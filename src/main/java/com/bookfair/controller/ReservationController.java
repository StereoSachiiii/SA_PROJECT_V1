package com.bookfair.controller;

import com.bookfair.dto.request.ReservationRequest;
import com.bookfair.dto.response.ReservationResponse;
import com.bookfair.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {
    
    private final ReservationService reservationService;
    
    
    @PostMapping
    public ResponseEntity<List<ReservationResponse>> create(@RequestBody ReservationRequest request) {
        return ResponseEntity.ok(reservationService.createReservations(request));
    }
    
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationResponse>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getByUser(userId));
    }
    
    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAll() {
        return ResponseEntity.ok(reservationService.getAll());
    }
}
