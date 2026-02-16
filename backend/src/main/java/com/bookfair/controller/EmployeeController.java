package com.bookfair.controller;

import com.bookfair.dto.response.DashboardStats;
import com.bookfair.dto.response.QrVerificationResponse;
import com.bookfair.dto.response.ReservationResponse;
import com.bookfair.exception.ResourceNotFoundException;
import com.bookfair.repository.ReservationRepository;
import com.bookfair.repository.StallRepository;
import com.bookfair.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Employee-only portal controller for exhibition organizers.
 *
 * Provides dashboard statistics (stall availability, reservation counts),
 * a list of all reservations, and QR code verification for entry passes.
 */
@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final StallRepository stallRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    /**
     * Dashboard stats: total stalls, reserved, available, users, reservations.
     * Reserved count is derived from the reservations table (not a boolean on stalls).
     */
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        long totalStalls = stallRepository.count();
        long reservedStalls = stallRepository.countReserved();
        long availableStalls = totalStalls - reservedStalls;
        long totalUsers = userRepository.count();
        long totalReservations = reservationRepository.count();

        return ResponseEntity.ok(DashboardStats.builder()
                .totalStalls(totalStalls)
                .reservedStalls(reservedStalls)
                .availableStalls(availableStalls)
                .totalUsers(totalUsers)
                .totalReservations(totalReservations)
                .build());
    }
    
    /**
     * List all reservations using ReservationResponse DTO (never raw entities).
     * This prevents leaking password hashes and avoids circular reference issues.
     */
    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        return ResponseEntity.ok(reservationRepository.findAll().stream()
                .map(ReservationController::mapToResponse)
                .toList());
    }

    /**
     * Verify a QR code scanned at the exhibition entrance.
     * Returns reservation details if valid, or an error message if the QR is unknown.
     */
    @PostMapping("/verify-qr")
    public ResponseEntity<QrVerificationResponse> verifyQr(@RequestBody Map<String, String> request) {
        String qrCode = request.get("qrCode");
        
        if (qrCode == null || qrCode.isBlank()) {
            return ResponseEntity.badRequest().body(QrVerificationResponse.builder()
                    .valid(false)
                    .message("Missing or empty 'qrCode' field")
                    .build());
        }
        
        return reservationRepository.findByQrCode(qrCode)
                .map(reservation -> ResponseEntity.ok(QrVerificationResponse.builder()
                        .valid(true)
                        .reservationId(reservation.getId())
                        .stallName(reservation.getStall().getName())
                        .businessName(reservation.getUser().getBusinessName())
                        .status(reservation.getStatus().name())
                        .build()))
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with QR code: " + qrCode));
    }
}