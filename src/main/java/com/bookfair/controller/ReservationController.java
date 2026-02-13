package com.bookfair.controller;

import com.bookfair.dto.request.ReservationRequest;
import com.bookfair.entity.Reservation;
import com.bookfair.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Reservation Controller
 * 
 * TODO [BACKEND DEV 2]: Add error handling
 * - Return proper HTTP status codes (400 for bad request, 409 for conflict)
 * - Add @ControllerAdvice for global exception handling
 */
@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {
    
    private final ReservationService reservationService;
    
    /**
     * POST /api/reservations
     * Create new reservation(s) for stalls
     * Body: { publisherId: 1, stallIds: [1, 2, 3] }
     */
    @PostMapping
    public ResponseEntity<List<Reservation>> create(@RequestBody ReservationRequest request) {
        return ResponseEntity.ok(reservationService.createReservations(request));
    }
    
    /**
     * GET /api/reservations/user/{userId}
     * Get reservations for a specific user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reservation>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getByUser(userId));
    }
    
    /**
     * GET /api/reservations
     * Get all reservations (for employee portal)
     */
    @GetMapping
    public ResponseEntity<List<Reservation>> getAll() {
        return ResponseEntity.ok(reservationService.getAll());
    }
}
