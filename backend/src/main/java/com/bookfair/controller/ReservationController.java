package com.bookfair.controller;

import com.bookfair.dto.request.ReservationRequest;
import com.bookfair.dto.response.ReservationResponse;
import com.bookfair.entity.Reservation;
import com.bookfair.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.bookfair.service.QrService;

/**

 * Reservation Controller
 *
 * Handles creating and querying reservations.
 * All responses use ReservationResponse DTO (never raw entities).
 */
@RestController
@RequestMapping("/api/v1/vendor/reservations")
@RequiredArgsConstructor
public class ReservationController {
    
    private final ReservationService reservationService;
    private final QrService qrService;

    @GetMapping("/{id}/qr/download")
    public ResponseEntity<byte[]> downloadQrCode(@PathVariable Long id, Principal principal) {
        Reservation reservation = reservationService.getById(id, principal.getName());
        byte[] qrImage = qrService.generateQrCode(reservation.getQrCode());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"qr-pass-" + id + ".png\"")
                .contentType(MediaType.IMAGE_PNG)
                .body(qrImage);
    }
    
    @PostMapping
    public ResponseEntity<List<ReservationResponse>> create(@jakarta.validation.Valid @RequestBody ReservationRequest request) {
        return ResponseEntity.ok(reservationService.createReservations(request).stream()
                .map(r -> mapToResponse(r))
                .collect(Collectors.toList()));
    }

    /**
     * POST /api/reservations/confirm-payment/{id}
     * Transitions a reservation from PENDING to PAID.
     * In a real app, this would be called by a Stripe webhook or Payment Gateway callback.
     */
    @PostMapping("/confirm-payment/{id}")
    public ResponseEntity<Void> confirmPayment(@PathVariable Long id) {
        reservationService.confirmPayment(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(Principal principal) {
        return ResponseEntity.ok(reservationService.getByUsername(principal.getName()).stream()
                .map(ReservationController::mapToResponse)
                .collect(Collectors.toList()));
    }

    @GetMapping("/available-count")
    public ResponseEntity<java.util.Map<String, Integer>> getAvailableCount(@RequestParam(required = false) Long eventId, Principal principal) {
        return ResponseEntity.ok(reservationService.getAvailableCount(principal.getName(), eventId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationResponse>> getByUser(@PathVariable Long userId, Principal principal) {
        return ResponseEntity.ok(reservationService.getByUser(userId, principal.getName()).stream()
                .map(ReservationController::mapToResponse)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> getById(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(mapToResponse(reservationService.getById(id, principal.getName())));
    }

    /**
     * GET /api/v1/vendor/reservations
     * Get all reservations for the currently logged-in vendor.
     * Admin/Employee have their own dedicated reservation list endpoints.
     */
    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAllMyReservations(Principal principal) {
        return ResponseEntity.ok(
            reservationService.getByUsername(principal.getName())
                .stream()
                .map(ReservationController::mapToResponse)
                .collect(Collectors.toList())
        );
    }

    /**
     * Maps a Reservation entity to a ReservationResponse DTO.
     * Aligned with API.md V4.5: returns stalls as List<String>.
     */
    public static ReservationResponse mapToResponse(Reservation r) {
        ReservationResponse res = new ReservationResponse();
        res.setId(r.getId());
        res.setQrCode(r.getQrCode());
        res.setStatus(r.getStatus().name());
        res.setEmailSent(r.getEmailSent() != null ? r.getEmailSent() : false);
        res.setCreatedAt(r.getCreatedAt());

        if (r.getUser() != null) {
            res.setUser(new ReservationResponse.UserSummary(
                r.getUser().getId(),
                r.getUser().getUsername(),
                r.getUser().getEmail(),
                r.getUser().getBusinessName(),
                r.getUser().getContactNumber(),
                r.getUser().getRole() != null ? r.getUser().getRole().name() : null,
                r.getUser().getCategories() != null ? r.getUser().getCategories().stream().map(Enum::name).collect(java.util.stream.Collectors.toList()) : null
            ));
        }

        if (r.getEventStall() != null) {
            String tempName = null;
            if (r.getEventStall().getStallTemplate() != null) {
                tempName = r.getEventStall().getStallTemplate().getName();
                res.setStalls(java.util.Collections.singletonList(tempName));
                
                // Map enriched stall details
                com.bookfair.entity.StallTemplate template = r.getEventStall().getStallTemplate();
                res.setStallDetails(new ReservationResponse.StallSummary(
                        r.getEventStall().getId(),
                        template.getName(),
                        template.getSize() != null ? template.getSize().name() : null,
                        r.getEventStall().getFinalPriceCents(),
                        r.getEventStall().getBaseRateCents(),
                        r.getEventStall().getMultiplier(),
                        template.getHall() != null ? template.getHall().getName() : null,
                        template.getHall() != null && template.getHall().getTier() != null ? template.getHall().getTier().name() : null,
                        template.getHall() != null ? template.getHall().getFloorLevel() : null,
                        template.getHall() != null && template.getHall().getBuilding() != null ? template.getHall().getBuilding().getName() : null,
                        true,
                        template.getGeometry()
                ));
            }
            res.setTotalPriceCents(r.getEventStall().getFinalPriceCents());
            
            if (r.getEventStall().getEvent() != null) {
                res.setEvent(new ReservationResponse.EventSummary(
                    r.getEventStall().getEvent().getId(),
                    r.getEventStall().getEvent().getName(),
                    r.getEventStall().getEvent().getVenue() != null ? r.getEventStall().getEvent().getVenue().getName() : null
                ));
            }
        } else {
            res.setStalls(java.util.Collections.emptyList());
        }

        return res;
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id, Principal principal) {
        reservationService.cancelReservation(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/v1/reservations/request-refund/{id}
     * Vendor requests a refund. Changes status from PAID to PENDING_REFUND
     */
    @PostMapping("/request-refund/{id}")
    public ResponseEntity<Void> requestRefund(
            @PathVariable Long id, 
            Principal principal,
            @RequestParam(required = false, defaultValue = "Vendor requested refund") String reason) {
        reservationService.requestRefund(id, principal.getName(), reason);
        return ResponseEntity.ok().build();
    }
}
