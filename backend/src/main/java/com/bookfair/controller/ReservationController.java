package com.bookfair.controller;

import com.bookfair.dto.request.ReservationRequest;
import com.bookfair.dto.response.ReservationResponse;
import com.bookfair.entity.Reservation;
import com.bookfair.service.ReservationService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

/**
 * Reservation Controller
 *
 * Handles creating and querying reservations.
 * All responses use ReservationResponse DTO (never raw entities).
 */
@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {
    
    private final ReservationService reservationService;
    
    @PostMapping
    public ResponseEntity<List<ReservationResponse>> create(@Valid @RequestBody ReservationRequest request) {
        return ResponseEntity.ok(reservationService.createReservations(request).stream()
                .map(ReservationController::mapToResponse)
                .toList());
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationResponse>> getByUser(@PathVariable Long userId, Principal principal) {
        return ResponseEntity.ok(reservationService.getByUser(userId, principal.getName()).stream()
                .map(ReservationController::mapToResponse)
                .toList());
    }
    }
    
    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAll() {
        return ResponseEntity.ok(reservationService.getAll().stream()
                .map(ReservationController::mapToResponse)
                .toList());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id, Principal principal) {
        reservationService.cancelReservation(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    /**
     * Maps a Reservation entity to a ReservationResponse DTO with nested user/stall objects.
     * This structure matches the frontend TypeScript Reservation type.
     */
    static ReservationResponse mapToResponse(Reservation reservation) {
        ReservationResponse response = new ReservationResponse();
        response.setId(reservation.getId());
        response.setQrCode(reservation.getQrCode());
        response.setStatus(reservation.getStatus().name());
        response.setEmailSent(reservation.getEmailSent());
        response.setCreatedAt(reservation.getCreatedAt());

        // Nested user summary (no password, no sensitive data)
        ReservationResponse.UserSummary userSummary = new ReservationResponse.UserSummary();
        userSummary.setId(reservation.getUser().getId());
        userSummary.setUsername(reservation.getUser().getUsername());
        userSummary.setEmail(reservation.getUser().getEmail());
        userSummary.setBusinessName(reservation.getUser().getBusinessName());
        userSummary.setContactNumber(reservation.getUser().getContactNumber());
        userSummary.setRole(reservation.getUser().getRole().name());
        response.setUser(userSummary);

        // Nested stall summary
        ReservationResponse.StallSummary stallSummary = new ReservationResponse.StallSummary();
        stallSummary.setId(reservation.getStall().getId());
        stallSummary.setName(reservation.getStall().getName());
        stallSummary.setSize(reservation.getStall().getSize().name());
        stallSummary.setReserved(true); // if it's in a reservation, it's reserved
        stallSummary.setPositionX(reservation.getStall().getPositionX());
        stallSummary.setPositionY(reservation.getStall().getPositionY());
        response.setStall(stallSummary);

        return response;
    }
}
