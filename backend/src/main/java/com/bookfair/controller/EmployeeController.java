package com.bookfair.controller;

import com.bookfair.dto.response.DashboardStats;
import com.bookfair.entity.Reservation;
import com.bookfair.repository.ReservationRepository;
import com.bookfair.repository.StallRepository;
import com.bookfair.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
     * List all reservations with full stall and user details (eager-loaded).
     */
    @GetMapping("/reservations")
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationRepository.findAll());
    }

    /**
     * Verify a QR code scanned at the exhibition entrance.
     * Returns reservation details if valid, or an error if the QR is unknown.
     */
    @PostMapping("/verify-qr")
    public ResponseEntity<?> verifyQr(@RequestBody Map<String, String> request) {
        String qrCode = request.get("qrCode");
        
        return reservationRepository.findByQrCode(qrCode)
                .map(reservation -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("valid", true);
                    response.put("reservationId", reservation.getId());
                    response.put("stall", reservation.getStall().getName());
                    response.put("user", reservation.getUser().getBusinessName());
                    response.put("status", reservation.getStatus().name());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Invalid QR Code")));
    }
}
