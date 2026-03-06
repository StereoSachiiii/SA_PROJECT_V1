package com.bookfair.controller;

import com.bookfair.service.AdminReservationService;
import com.bookfair.features.reservation.dto.ReservationResponse;
import com.bookfair.features.reservation.ReservationController;
import com.bookfair.dto.request.RefundRequest;
import com.bookfair.dto.response.RefundResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminReservationController {

    private final AdminReservationService adminReservationService;

    @GetMapping("/refunds/pending")
    public ResponseEntity<List<ReservationResponse>> getPendingRefunds() {
        return ResponseEntity.ok(adminReservationService.getPendingRefunds().stream()
                .map(ReservationController::mapToResponse)
                .collect(Collectors.toList()));
    }

    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        return ResponseEntity.ok(adminReservationService.getAllReservations().stream()
                .map(ReservationController::mapToResponse)
                .collect(Collectors.toList()));
    }

    @GetMapping("/reservations/{id}")
    public ResponseEntity<ReservationResponse> getReservation(@PathVariable Long id) {
        return ResponseEntity.ok(ReservationController.mapToResponse(adminReservationService.getReservationById(id)));
    }

    @PostMapping("/reservations/{id}/confirm-payment")
    public ResponseEntity<Void> confirmPayment(@PathVariable Long id) {
        adminReservationService.adminConfirmPayment(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reservations/{id}/cancel")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id, @RequestParam String reason) {
        adminReservationService.adminCancelReservation(id, reason);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reservations/export")
    public ResponseEntity<byte[]> exportReservations() {
        byte[] csv = adminReservationService.exportReservationsCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reservations.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    @PostMapping("/payments/refund")
    public ResponseEntity<RefundResponse> refundReservation(@jakarta.validation.Valid @RequestBody RefundRequest request) {
        String refundTxId = adminReservationService.refundReservation(request.getReservationId(), request.getReason());
        return ResponseEntity.ok(RefundResponse.builder()
                .id(request.getReservationId())
                .status("REFUND_ISSUED")
                .refundTxId(refundTxId)
                .refundedAt(java.time.LocalDateTime.now().toString())
                .reason(request.getReason())
                .build());
    }
}
