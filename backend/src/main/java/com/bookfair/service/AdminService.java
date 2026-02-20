package com.bookfair.service;

import com.bookfair.entity.*;
import com.bookfair.repository.*;
import com.bookfair.dto.response.AdminDashboardStats;
import com.bookfair.exception.ResourceNotFoundException;
import com.bookfair.exception.BadRequestException;
import com.bookfair.exception.ConflictException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final EventRepository eventRepository;
    private final EventStallRepository eventStallRepository;
    private final StallTemplateRepository stallTemplateRepository;
    private final ReservationRepository reservationRepository;
    private final HallRepository hallRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    // ─── MAP UPLOAD ───────────────────────────────────────────────

    @Transactional
    public String uploadVenueMap(Long eventId, MultipartFile file) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        try {
            String originalFileName = file.getOriginalFilename();
            String extension = "png";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1);
            }
            
            String fileName = "map_" + eventId + "_" + System.currentTimeMillis() + "." + extension;
            Path uploadPath = Paths.get("./uploads");
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            String mapUrl = "/uploads/" + fileName;
            Map<String, String> config = Map.of("mapUrl", mapUrl);
            event.setLayoutConfig(objectMapper.writeValueAsString(config));
            eventRepository.save(event);
            
            return mapUrl;
        } catch (IOException e) {
            throw new BadRequestException("Failed to save map file: " + e.getMessage());
        } catch (Exception e) {
            throw new BadRequestException("Failed to process map upload: " + e.getMessage());
        }
    }

    // ─── LAYOUT ──────────────────────────────────────────────────

    @Transactional
    public List<EventStall> saveEventLayout(Long eventId, List<com.bookfair.dto.request.EventStallUpdateRequest> stalls) {
        if (stalls == null) return List.of();
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        List<EventStall> updatedItems = stalls.stream().map(dto -> {
            if (dto.getId() != null) {
                // Existing EventStall
                EventStall existing = eventStallRepository.findById(dto.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Stall not found: " + dto.getId()));
                existing.setGeometry(dto.getGeometry());
                existing.setPricingVersion("MANUAL_LAYOUT_UPDATE");
                if (dto.getFinalPriceCents() != null) {
                    existing.setFinalPriceCents(dto.getFinalPriceCents());
                }
                if (dto.getName() != null && existing.getStallTemplate() != null) {
                    existing.getStallTemplate().setName(dto.getName());
                }
                return existing;
            } else if (dto.getName() != null && dto.getHallName() != null) {
                // Create New Stall
                Hall hall = hallRepository.findByName(dto.getHallName())
                        .orElseThrow(() -> new ResourceNotFoundException("Hall not found: " + dto.getHallName()));
                
                // 1. Create StallTemplate
                StallTemplate template = StallTemplate.builder()
                        .name(dto.getName())
                        .hall(hall)
                        .size(StallSize.MEDIUM) // Default
                        .type(StallType.STANDARD)
                        .category(StallCategory.RETAIL)
                        .basePriceCents(dto.getFinalPriceCents() != null ? dto.getFinalPriceCents() : 500000L)
                        .defaultProximityScore(50)
                        .geometry(dto.getGeometry())
                        .isAvailable(true)
                        .build();
                template = stallTemplateRepository.save(template);

                // 2. Create EventStall
                EventStall es = EventStall.builder()
                        .event(event)
                        .stallTemplate(template)
                        .baseRateCents(template.getBasePriceCents())
                        .multiplier(1.0)
                        .proximityBonusCents(0L)
                        .finalPriceCents(template.getBasePriceCents())
                        .geometry(dto.getGeometry())
                        .status(EventStallStatus.AVAILABLE)
                        .pricingVersion("DESIGNER_INIT")
                        .build();
                return es;
            }
            return null;
        }).filter(java.util.Objects::nonNull).collect(Collectors.toList());

        return eventStallRepository.saveAll(updatedItems);
    }

    @Transactional
    public void updateHallLayout(Long hallId, String staticLayoutJson) {
        Hall hall = hallRepository.findById(hallId)
                .orElseThrow(() -> new ResourceNotFoundException("Hall not found: " + hallId));
        hall.setStaticLayout(staticLayoutJson);
        hallRepository.save(hall);
    }

    // ─── DASHBOARD ────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public AdminDashboardStats getDashboardStats() {
        long totalReservations = reservationRepository.countByStatusIn(List.of(
            Reservation.ReservationStatus.PAID,
            Reservation.ReservationStatus.PENDING_PAYMENT
        ));
        long totalRevenueCents = reservationRepository.sumTotalRevenueCents();
        long activeVendors    = reservationRepository.countActiveVendors();
        long totalStalls      = eventStallRepository.count();
        double fillRate       = totalStalls > 0 ? (double) totalReservations / totalStalls * 100.0 : 0.0;

        return AdminDashboardStats.builder()
                .totalReservations(totalReservations)
                .totalRevenueLkr(totalRevenueCents)
                .activeVendors(activeVendors)
                .fillRate(fillRate)
                .build();
    }

    @Transactional
    public com.bookfair.entity.StallTemplate updateStallTemplate(Long hallId, Long stallId, com.bookfair.dto.request.StallTemplateUpdateRequest req) {
        com.bookfair.entity.StallTemplate template = stallTemplateRepository.findById(stallId)
                .orElseThrow(() -> new ResourceNotFoundException("Stall template not found: " + stallId));
        if (!template.getHall().getId().equals(hallId)) {
            throw new BadRequestException("Stall does not belong to this hall.");
        }
        if (req.getName() != null) template.setName(req.getName());
        if (req.getSize() != null) template.setSize(req.getSize());
        if (req.getType() != null) template.setType(req.getType());
        if (req.getCategory() != null) template.setCategory(req.getCategory());
        if (req.getBasePriceCents() != null) template.setBasePriceCents(req.getBasePriceCents());
        if (req.getSqFt() != null) template.setSqFt(req.getSqFt());
        if (req.getIsAvailable() != null) template.setIsAvailable(req.getIsAvailable());
        if (req.getDefaultProximityScore() != null) template.setDefaultProximityScore(req.getDefaultProximityScore());
        if (req.getGeometry() != null) template.setGeometry(req.getGeometry());
        if (req.getImageUrl() != null) template.setImageUrl(req.getImageUrl());

        stallTemplateRepository.save(template);
        logAudit("UPDATE_STALL_TEMPLATE", "STALL_TEMPLATE", stallId, req);
        return template;
    }

    // ─── RESERVATIONS ─────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + id));
    }

    /** Admin confirms payment overriding normal vendor flow */
    @Transactional
    public void adminConfirmPayment(Long reservationId) {
        Reservation res = getReservationById(reservationId);
        if (res.getStatus() != Reservation.ReservationStatus.PENDING_PAYMENT) {
            throw new BadRequestException("Reservation is not in PENDING_PAYMENT status");
        }
        res.setStatus(Reservation.ReservationStatus.PAID);
        reservationRepository.save(res);
        logAudit("ADMIN_CONFIRM_PAYMENT", "RESERVATION", reservationId, null);
    }

    /** Admin cancels any reservation */
    @Transactional
    public void adminCancelReservation(Long reservationId, String reason) {
        Reservation res = getReservationById(reservationId);
        if (res.getStatus() == Reservation.ReservationStatus.CANCELLED) {
            throw new BadRequestException("Reservation is already cancelled");
        }
        // Free the stall
        EventStall stall = res.getEventStall();
        stall.setStatus(EventStallStatus.AVAILABLE);
        eventStallRepository.save(stall);

        res.setStatus(Reservation.ReservationStatus.CANCELLED);
        reservationRepository.save(res);
        logAudit("ADMIN_CANCEL_RESERVATION", "RESERVATION", reservationId, Map.of("reason", reason));
    }

    /** Export all reservations as CSV bytes */
    @Transactional(readOnly = true)
    public byte[] exportReservationsCsv() {
        List<Reservation> reservations = reservationRepository.findAll();
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Vendor,Email,QRCode,Status,TotalLKR,CreatedAt\n");
        for (Reservation r : reservations) {
            sb.append(r.getId()).append(',')
              .append(r.getUser() != null ? r.getUser().getUsername() : "").append(',')
              .append(r.getUser() != null ? r.getUser().getEmail() : "").append(',')
              .append(r.getQrCode()).append(',')
              .append(r.getStatus()).append(',')
              .append(r.getEventStall() != null && r.getEventStall().getFinalPriceCents() != null ? r.getEventStall().getFinalPriceCents() : 0).append(',')
              .append(r.getCreatedAt()).append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    // ─── EVENT STALLS ─────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<EventStall> getEventStalls(Long eventId) {
        return eventStallRepository.findByEvent_Id(eventId);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getEventStats(Long eventId) {
        List<EventStall> stalls = eventStallRepository.findByEvent_Id(eventId);
        long total    = stalls.size();
        long reserved = stalls.stream().filter(s -> s.getStatus() == EventStallStatus.RESERVED).count();
        long available = stalls.stream().filter(s -> s.getStatus() == EventStallStatus.AVAILABLE).count();
        long blocked  = stalls.stream().filter(s -> s.getStatus() == EventStallStatus.BLOCKED).count();
        long revenueReserved = stalls.stream()
                .filter(s -> s.getStatus() == EventStallStatus.RESERVED)
                .mapToLong(s -> s.getFinalPriceCents() != null ? s.getFinalPriceCents() : 0).sum();

        return Map.of(
            "eventId", eventId,
            "totalStalls", total,
            "reservedStalls", reserved,
            "availableStalls", available,
            "blockedStalls", blocked,
            "fillRate", total > 0 ? (double) reserved / total * 100.0 : 0.0,
            "projectedRevenueCents", revenueReserved
        );
    }

    // ─── PRICING ─────────────────────────────────────────────────

    @Transactional
    public Map<String, Object> updateStallPrice(Long stallId, Map<String, Object> request) {
        EventStall stall = eventStallRepository.findById(stallId)
                .orElseThrow(() -> new ResourceNotFoundException("EventStall not found: " + stallId));

        if (request.containsKey("baseRateCents")) {
            long base = Long.parseLong(request.get("baseRateCents").toString());
            double multiplier = request.containsKey("multiplier")
                    ? Double.parseDouble(request.get("multiplier").toString())
                    : 1.0;
            if (base < 0) throw new BadRequestException("Price cannot be negative");
            stall.setFinalPriceCents((long) (base * multiplier));
            stall.setPricingVersion("MANUAL_PRICE_UPDATE");
        }
        eventStallRepository.save(stall);
        logAudit("PRICE_OVERRIDE", "EVENT_STALL", stallId, request);

        return Map.of("stallId", stallId, "finalPriceCents", stall.getFinalPriceCents());
    }

    // ─── REFUNDS ─────────────────────────────────────────────────

    /**
     * Marks a reservation as cancelled for refund purposes.
     * Opens up the stall for the public.
     * NOTE: This does NOT issue an actual Stripe refund — refunds must be processed
     * manually through the Stripe dashboard. This is by design for this project scope.
     */
    @Transactional
    public Map<String, Object> refundReservation(Long reservationId, String reason) {
        Reservation reservation = getReservationById(reservationId);
        
        if (reservation.getStatus() != Reservation.ReservationStatus.PENDING_REFUND &&
            reservation.getStatus() != Reservation.ReservationStatus.PAID) {
            throw new BadRequestException("Only PAID or PENDING_REFUND reservations can be refunded.");
        }

        // Free the stall
        EventStall stall = reservation.getEventStall();
        if (stall != null) {
            stall.setStatus(EventStallStatus.AVAILABLE);
            eventStallRepository.save(stall);
        }

        reservation.setStatus(Reservation.ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
        logAudit("REFUND_ISSUED", "RESERVATION", reservationId, Map.of("reason", reason != null ? reason : ""));

        return Map.of(
            "id", reservationId,
            "status", "CANCELLED_PENDING_MANUAL_REFUND",
            "refundTxId", "MANUAL-" + reservationId,
            "refundedAt", java.time.LocalDateTime.now().toString(),
            "reason", reason != null ? reason : ""
        );
    }

    // ─── AUDIT LOGS ───────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Map<String, Object> getAuditLogs(String entityType, Long actorId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<AuditLog> result = auditLogRepository.findFiltered(
            entityType != null && !entityType.isEmpty() ? entityType : null,
            actorId,
            pageRequest
        );

        List<Map<String, Object>> content = result.getContent().stream().map(log -> Map.<String, Object>of(
            "id", log.getId(),
            "actorId", log.getActor() != null ? log.getActor().getId() : 0,
            "action", log.getAction(),
            "entityType", log.getEntityType(),
            "entityId", log.getEntityId() != null ? log.getEntityId() : 0,
            "timestamp", log.getTimestamp().toString(),
            "metadata", log.getMetadata() != null ? log.getMetadata() : ""
        )).collect(Collectors.toList());

        return Map.of(
            "content", content,
            "totalElements", result.getTotalElements(),
            "totalPages", result.getTotalPages(),
            "size", result.getSize(),
            "number", result.getNumber()
        );
    }

    // ─── INTERNAL: AUDIT LOG WRITER ──────────────────────────────

    private void logAudit(String action, String entityType, Long entityId, Object metadata) {
        try {
            AuditLog log = AuditLog.builder()
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .metadata(metadata != null ? objectMapper.writeValueAsString(metadata) : null)
                    .build();
            auditLogRepository.save(log);
        } catch (Exception e) {
            // Audit failure should never crash the main transaction
        }
    }
}
