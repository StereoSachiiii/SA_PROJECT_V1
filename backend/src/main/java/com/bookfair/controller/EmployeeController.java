package com.bookfair.controller;

import com.bookfair.dto.response.CheckInResponse;
import com.bookfair.dto.response.DashboardStats;
import com.bookfair.dto.response.QrVerificationResponse;
import com.bookfair.dto.response.ReservationResponse;
import com.bookfair.repository.ReservationRepository;
import com.bookfair.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.bookfair.service.NotificationService;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**

 * Employee-only portal controller for exhibition organizers.
 *
 * Provides dashboard statistics (stall availability, reservation counts),
 * a list of all reservations, and QR code verification for entry passes.
 */
@RestController
@RequestMapping("/api/v1/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final com.bookfair.repository.EventStallRepository eventStallRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final com.bookfair.repository.CheckInLogRepository checkInLogRepository;
    private final NotificationService notificationService;
    private final com.bookfair.service.ReservationService reservationService;

    /**
     * Dashboard stats: total stalls, reserved, available, users, reservations.
     * Reserved count is derived from active (PAID or PENDING) reservations.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        long totalStalls = eventStallRepository.count();
        // Count reserved by checking active reservations across all events
        long reservedStalls = reservationRepository.countByStatusIn(List.of(
            com.bookfair.entity.Reservation.ReservationStatus.PAID,
            com.bookfair.entity.Reservation.ReservationStatus.PENDING_PAYMENT
        ));
        long availableStalls = totalStalls - reservedStalls;
        long totalUsers = userRepository.count();
        long totalReservations = reservationRepository.count();

        long checkedIn = checkInLogRepository.count();

        return ResponseEntity.ok(DashboardStats.builder()
                .totalStalls(totalStalls)
                .reservedStalls(reservedStalls)
                .availableStalls(availableStalls)
                .totalUsers(totalUsers)
                .totalReservations(totalReservations)
                .checkedInCount(checkedIn)
                .build());
    }
    
    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        return ResponseEntity.ok(reservationRepository.findAll().stream()
                .map(ReservationController::mapToResponse)
                .collect(Collectors.toList()));
    }

    /**
     * GET /api/v1/employee/search?q=&status=&eventId=
     * Search reservations by vendor business name or username with optional filters.
     * Returns a page-style envelope so the frontend's PageEnvelope<Reservation> type is satisfied.
     */
    @GetMapping("/search")
    public ResponseEntity<java.util.Map<String, Object>> searchReservations(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long eventId) {

        com.bookfair.entity.Reservation.ReservationStatus statusEnum = status != null && !status.isEmpty() 
            ? com.bookfair.entity.Reservation.ReservationStatus.valueOf(status) 
            : null;

        List<ReservationResponse> results = reservationRepository.searchReservations(q, statusEnum, eventId).stream()
                .map(ReservationController::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(java.util.Map.of(
            "content", results,
            "totalElements", results.size(),
            "totalPages", 1,
            "size", results.size(),
            "number", page
        ));
    }

    /**
     * GET /api/v1/employee/attendance/export
     * Exports attendance log as CSV.
     */
    @GetMapping("/attendance/export")
    public ResponseEntity<byte[]> exportAttendance() {
        StringBuilder csv = new StringBuilder("LogID,Timestamp,ReservationID,Stall,Vendor,Employee,OverrideReason\n");
        List<com.bookfair.entity.CheckInLog> logs = checkInLogRepository.findAll();
        
        for (com.bookfair.entity.CheckInLog log : logs) {
            com.bookfair.entity.Reservation res = log.getReservation();
            csv.append(log.getId()).append(",")
               .append(log.getCheckInTime()).append(",")
               .append(res.getId()).append(",")
               .append(res.getEventStall().getStallTemplate().getName()).append(",")
               .append(res.getUser().getBusinessName()).append(",")
               .append(log.getEmployee().getUsername()).append(",")
               .append(log.getOverrideReason() != null ? log.getOverrideReason() : "N/A")
               .append("\n");
        }

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=attendance.csv")
                .header("Content-Type", "text/csv")
                .body(csv.toString().getBytes());
    }

    /**
     * POST /api/v1/employee/qr/validate
     * Pre-validation dry-run for QR codes.
     */
    /**
     * GET /api/v1/employee/reservations/{qrOrId}
     * Lookup reservation by QR code or reservation ID.
     * Lookup only - no DB mutations.
     */
    @GetMapping("/reservations/{qrOrId}")
    public ResponseEntity<QrVerificationResponse> lookupReservation(@PathVariable String qrOrId) {
        // Try QR code first, then reservation ID
        var reservation = reservationRepository.findByQrCode(qrOrId)
                .or(() -> {
                    try {
                        Long id = Long.parseLong(qrOrId);
                        return reservationRepository.findById(id);
                    } catch (NumberFormatException e) {
                        return java.util.Optional.empty();
                    }
                });
        
        return reservation
                .map(res -> {
                    boolean isPaid = res.getStatus() == com.bookfair.entity.Reservation.ReservationStatus.PAID;
                    boolean alreadyCheckedIn = checkInLogRepository.existsByReservationId(res.getId());
                    String stallName = res.getEventStall() != null && res.getEventStall().getStallTemplate() != null ? 
                                       res.getEventStall().getStallTemplate().getName() : "Unknown";
                    
                    return ResponseEntity.ok(QrVerificationResponse.builder()
                        .valid(isPaid && !alreadyCheckedIn)
                        .reservationId(res.getId())
                        .stallName(stallName)
                        .businessName(res.getUser().getBusinessName())
                        .status(res.getStatus().name())
                        .message(alreadyCheckedIn ? "Already checked in" : 
                                isPaid ? "Ready to admit" : "Payment pending - override required")
                        .build());
                })
                .orElseGet(() -> ResponseEntity.badRequest().body(QrVerificationResponse.builder()
                        .valid(false)
                        .message("Reservation not found")
                        .build()));
    }

    /**
     * POST /api/v1/employee/reservations/{reservationId}/admit
     * Record check-in for a PAID reservation.
     * Creates CheckInLog and sends notification.
     */
    @PostMapping("/reservations/{reservationId}/admit")
    public ResponseEntity<CheckInResponse> admitReservation(
            @PathVariable Long reservationId,
            java.security.Principal principal) {
        
        com.bookfair.entity.Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new com.bookfair.exception.ResourceNotFoundException("Reservation not found"));
        
        // Only PAID reservations can be admitted normally
        if (reservation.getStatus() != com.bookfair.entity.Reservation.ReservationStatus.PAID) {
            throw new com.bookfair.exception.BadRequestException("Cannot admit: Status is " + reservation.getStatus());
        }

        com.bookfair.entity.CheckInLog log = performCheckIn(reservation, principal, null, null);
        
        return ResponseEntity.ok(CheckInResponse.builder()
                .reservationId(reservation.getId())
                .status("CHECKED_IN")
                .vendor(reservation.getUser().getBusinessName())
                .timestamp(log.getCheckInTime())
                .build());
    }

    @PostMapping("/force-check-in")
    public ResponseEntity<CheckInResponse> forceCheckIn(@RequestBody Map<String, Object> request, java.security.Principal principal) {
        Long reservationId = Long.valueOf(request.get("reservationId").toString());
        String reason = (String) request.get("reason");
        String adminCode = (String) request.get("adminOverrideCode");
        
        com.bookfair.entity.Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new com.bookfair.exception.ResourceNotFoundException("Reservation not found"));

        com.bookfair.entity.CheckInLog log = performCheckIn(reservation, principal, reason, adminCode);

        return ResponseEntity.ok(CheckInResponse.builder()
                .reservationId(reservation.getId())
                .status("CHECKED_IN")
                .vendor(reservation.getUser().getBusinessName())
                .timestamp(log.getCheckInTime())
                .build());
    }

    @GetMapping("/qr/test")
    public ResponseEntity<java.util.Map<String, String>> getTestQrCode() {
        // Find first paid reservation (or create a test one)
        var testReservation = reservationRepository.findAll().stream()
                .filter(r -> r.getStatus() == com.bookfair.entity.Reservation.ReservationStatus.PAID)
                .findFirst();
        
        if (testReservation.isPresent()) {
            return ResponseEntity.ok(java.util.Map.of(
                "qrCode", testReservation.get().getQrCode(),
                "message", "Test QR code - scan to validate"
            ));
        }
        
        return ResponseEntity.badRequest().body(java.util.Map.of(
            "message", "No test reservations available"
        ));
    }

    private com.bookfair.entity.CheckInLog performCheckIn(com.bookfair.entity.Reservation reservation, java.security.Principal principal, String reason, String adminCode) {
        com.bookfair.entity.User employee = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new com.bookfair.exception.ResourceNotFoundException("Logged in employee not found"));

        // Check duplicates
        if (checkInLogRepository.existsByReservationId(reservation.getId())) {
             throw new com.bookfair.exception.ConflictException("Reservation already checked in.");
        }

        com.bookfair.entity.CheckInLog log = com.bookfair.entity.CheckInLog.builder()
                .reservation(reservation)
                .employee(employee)
                .overrideReason(reason)
                .adminOverrideCode(adminCode)
                .build();
        
        com.bookfair.entity.CheckInLog savedLog = checkInLogRepository.save(log);

        // Notify Vendor
        notificationService.createNotification(
            reservation.getUser(),
            String.format("Welcome! You have successfully checked in for %s at stall %s.", 
                reservation.getEventStall().getEvent().getName(),
                reservation.getEventStall().getStallTemplate().getName()),
            com.bookfair.entity.Notification.NotificationType.SUCCESS
        );
        
        return savedLog;
    }

    /**
     * DELETE /api/v1/employee/reservations/{id}
     * Cancel a reservation at the gate (e.g. vendor requests cancellation in person).
     */
    @DeleteMapping("/reservations/{id}")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id, java.security.Principal principal) {
        reservationService.cancelReservation(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
