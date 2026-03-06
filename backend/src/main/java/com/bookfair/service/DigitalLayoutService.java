package com.bookfair.service;

import com.bookfair.entity.*;
import com.bookfair.repository.*;
import com.bookfair.dto.request.EventStallUpdateRequest;
import com.bookfair.dto.request.PhysicalConstraintRequest;
import com.bookfair.dto.response.MapInfluenceResponse;
import com.bookfair.dto.response.MapZoneResponse;
import com.bookfair.exception.BadRequestException;
import com.bookfair.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DigitalLayoutService {

    private final EventRepository eventRepository;
    private final EventStallRepository eventStallRepository;
    private final StallTemplateRepository stallTemplateRepository;
    private final HallRepository hallRepository;
    private final MapZoneRepository mapZoneRepository;
    private final MapInfluenceRepository mapInfluenceRepository;
    private final PhysicalConstraintRepository physicalConstraintRepository;
    private final PricingService pricingService;
    private final AuditLogService auditLogService;

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
            
            String url = "/api/v1/uploads/" + fileName;
            event.setMapUrl(url);
            eventRepository.save(event);
            
            auditLogService.logAudit("UPLOAD_MAP", "EVENT", eventId, "Uploaded " + originalFileName);
            return url;
        } catch (IOException e) {
            throw new BadRequestException("Failed to save map file: " + e.getMessage());
        }
    }

    @Transactional
    public void updateHallLayout(Long hallId, List<PhysicalConstraintRequest> constraints) {
        Hall hall = hallRepository.findById(hallId)
                .orElseThrow(() -> new ResourceNotFoundException("Hall not found: " + hallId));
        
        physicalConstraintRepository.deleteByHallId(hallId);
        
        if (constraints != null) {
            List<PhysicalConstraint> entities = constraints.stream().map(dto -> PhysicalConstraint.builder()
                    .hall(hall)
                    .type(dto.getType())
                    .posX(dto.getPosX())
                    .posY(dto.getPosY())
                    .width(dto.getWidth())
                    .height(dto.getHeight())
                    .label(dto.getLabel())
                    .build()).collect(Collectors.toList());
            physicalConstraintRepository.saveAll(entities);
        }
        auditLogService.logAudit("UPDATE_HALL_LAYOUT", "HALL", hallId, constraints);
    }

    @Transactional
    public List<EventStall> saveEventLayout(Long eventId, List<EventStallUpdateRequest> stalls) {
        if (stalls == null) return List.of();
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        List<Long> payloadStallIds = stalls.stream()
                .map(EventStallUpdateRequest::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        List<EventStall> existingStalls = eventStallRepository.findByEvent_Id(eventId);
        for (EventStall existing : existingStalls) {
            if (!payloadStallIds.contains(existing.getId())) {
                eventStallRepository.delete(existing);
            }
        }

        List<EventStall> updatedItems = stalls.stream().map(dto -> {
            if (dto.getId() != null) {
                EventStall existing = eventStallRepository.findById(dto.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Stall not found: " + dto.getId()));
                
                existing.setPosX(dto.getPosX());
                existing.setPosY(dto.getPosY());
                existing.setWidth(dto.getWidth());
                existing.setHeight(dto.getHeight());
                
                existing.setPricingVersion("MANUAL_LAYOUT_UPDATE");
                if (dto.getFinalPriceCents() != null) {
                    existing.setFinalPriceCents(dto.getFinalPriceCents());
                }
                if (dto.getName() != null && existing.getStallTemplate() != null) {
                    existing.getStallTemplate().setName(dto.getName());
                }
                return existing;
            } else if (dto.getName() != null && dto.getHallName() != null) {
                Hall hall = hallRepository.findByName(dto.getHallName())
                        .orElseThrow(() -> new ResourceNotFoundException("Hall not found: " + dto.getHallName()));
                
                StallTemplate template = StallTemplate.builder()
                        .name(dto.getName())
                        .hall(hall)
                        .size(StallSize.MEDIUM)
                        .type(StallType.STANDARD)
                        .category(StallCategory.RETAIL)
                        .basePriceCents(dto.getFinalPriceCents() != null ? dto.getFinalPriceCents() : 500000L)
                        .defaultProximityScore(50)
                        .posX(dto.getPosX())
                        .posY(dto.getPosY())
                        .width(dto.getWidth())
                        .height(dto.getHeight())
                        .isAvailable(true)
                        .build();
                template = stallTemplateRepository.save(template);

                return EventStall.builder()
                        .event(event)
                        .stallTemplate(template)
                        .baseRateCents(template.getBasePriceCents())
                        .multiplier(1.0)
                        .proximityBonusCents(0L)
                        .finalPriceCents(template.getBasePriceCents())
                        .posX(dto.getPosX())
                        .posY(dto.getPosY())
                        .width(dto.getWidth())
                        .height(dto.getHeight())
                        .status(EventStallStatus.AVAILABLE)
                        .pricingVersion("DESIGNER_INIT")
                        .build();
            }
            return null;
        }).filter(Objects::nonNull).collect(Collectors.toList());

        List<EventStall> saved = eventStallRepository.saveAll(updatedItems);
        pricingService.recalculateEventPrices(eventId);
        auditLogService.logAudit("SAVE_EVENT_LAYOUT", "EVENT", eventId, "Updated " + stalls.size() + " stalls");
        return saved;
    }

    @Transactional
    public void saveMapZones(Long eventId, List<MapZoneResponse> zones) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        
        List<MapZone> existing = mapZoneRepository.findByEvent_Id(eventId);
        mapZoneRepository.deleteAll(existing);

        List<MapZone> newZones = zones.stream().map(dto -> MapZone.builder()
                .event(event)
                .hallName(dto.getHallName())
                .type(MapZoneType.valueOf(dto.getType()))
                .posX(dto.getPosX())
                .posY(dto.getPosY())
                .width(dto.getWidth())
                .height(dto.getHeight())
                .label(dto.getLabel())
                .build()).collect(Collectors.toList());
        
        mapZoneRepository.saveAll(newZones);
        auditLogService.logAudit("SAVE_MAP_ZONES", "EVENT", eventId, "Updated " + zones.size() + " zones");
    }

    @Transactional
    public void saveMapInfluences(Long eventId, List<MapInfluenceResponse> influences) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        
        List<MapInfluence> existing = mapInfluenceRepository.findByEvent_Id(eventId);
        mapInfluenceRepository.deleteAll(existing);

        List<MapInfluence> newInfluences = influences.stream().map(dto -> MapInfluence.builder()
                .event(event)
                .hallName(dto.getHallName())
                .type(MapInfluenceType.valueOf(dto.getType()))
                .posX(dto.getPosX())
                .posY(dto.getPosY())
                .radius(dto.getRadius())
                .intensity(dto.getIntensity())
                .falloff(dto.getFalloff())
                .build()).collect(Collectors.toList());
        
        mapInfluenceRepository.saveAll(newInfluences);
        auditLogService.logAudit("SAVE_MAP_INFLUENCES", "EVENT", eventId, "Updated " + influences.size() + " influences");
    }
}
