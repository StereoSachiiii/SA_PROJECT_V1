package com.bookfair.controller;

import com.bookfair.dto.request.ReservationRequest;
import com.bookfair.dto.response.ReservationResponse;
import com.bookfair.entity.Reservation;
import com.bookfair.service.ReservationService;
import com.bookfair.service.QrService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller for Stall Reservation operations.
 * Strictly adheres to OWASP guidelines:
 * - Username is NEVER taken from request payload, only extracted from JWT principal.
 * - Endpoints enforce ownership checks and Role-Based Access Control (RBAC).
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final QrService qrService;

    private String getAuthenticatedUsername(Jwt jwt, Principal principal) {
        if (jwt != null) {
            String username = jwt.getClaimAsString("username");
            if (username == null) username = jwt.getClaimAsString("preferred_username");
            if (username == null) username = jwt.getSubject();
            if (username != null) return username;
        }
        if (principal != null) {
            return principal.getName();
        }
        throw new org.springframework.security.access.AccessDeniedException("Unauthenticated request");
    }

    /**
     * POST /api/reservations & /api/v1/vendor/reservations
     * Create a stall reservation for the authenticated vendor.
     */
    @PostMapping({"/reservations", "/v1/vendor/reservations"})
    public ResponseEntity<List<ReservationResponse>> create(
            @jakarta.validation.Valid @RequestBody ReservationRequest request,
            @AuthenticationPrincipal Jwt jwt,
            Principal principal) {
        String username = getAuthenticatedUsername(jwt, principal);
        List<Reservation> reservations = reservationService.createReservations(request, username);
        return ResponseEntity.ok(reservations.stream().map(ReservationController::mapToResponse).collect(Collectors.toList()));
    }

    /**
     * GET /api/reservations/my-reservations
     * Return only records matching the authenticated user's username.
     */
    @GetMapping({"/reservations/my-reservations", "/v1/vendor/reservations/me"})
    public ResponseEntity<List<ReservationResponse>> getMyReservations(
            @AuthenticationPrincipal Jwt jwt,
            Principal principal) {
        String username = getAuthenticatedUsername(jwt, principal);
        List<Reservation> reservations = reservationService.getByUsername(username);
        return ResponseEntity.ok(reservations.stream().map(ReservationController::mapToResponse).collect(Collectors.toList()));
    }

    /**
     * GET /api/admin/reservations
     * Restricted to ROLE_ORGANIZER (and ADMIN) only. Returns all stall reservation requests across vendors.
     */
    @GetMapping("/admin/reservations")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
    public ResponseEntity<List<ReservationResponse>> getAllAdminReservations() {
        List<Reservation> reservations = reservationService.getAll();
        return ResponseEntity.ok(reservations.stream().map(ReservationController::mapToResponse).collect(Collectors.toList()));
    }

    /**
     * GET /api/reservations/{id}
     */
    @GetMapping({"/reservations/{id}", "/v1/vendor/reservations/{id}"})
    public ResponseEntity<ReservationResponse> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt,
            Principal principal) {
        String username = getAuthenticatedUsername(jwt, principal);
        return ResponseEntity.ok(mapToResponse(reservationService.getById(id, username)));
    }

    /**
     * DELETE /api/reservations/{id}
     * Cancel reservation with ownership check.
     */
    @DeleteMapping({"/reservations/{id}", "/v1/vendor/reservations/{id}"})
    public ResponseEntity<Void> cancel(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt,
            Principal principal) {
        String username = getAuthenticatedUsername(jwt, principal);
        reservationService.cancelReservation(id, username);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/reservations/confirm-payment/{id}
     */
    @PostMapping("/reservations/confirm-payment/{id}")
    public ResponseEntity<Void> confirmPayment(@PathVariable Long id) {
        reservationService.confirmPayment(id);
        return ResponseEntity.ok().build();
    }

    /**
     * GET /api/reservations/{id}/qr/download
     */
    @GetMapping({"/reservations/{id}/qr/download", "/v1/vendor/reservations/{id}/qr/download"})
    public ResponseEntity<byte[]> downloadQrCode(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt,
            Principal principal) {
        String username = getAuthenticatedUsername(jwt, principal);
        Reservation reservation = reservationService.getById(id, username);
        byte[] qrImage = qrService.generateQrCode(reservation.getQrCode());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"qr-pass-" + id + ".png\"")
                .contentType(MediaType.IMAGE_PNG)
                .body(qrImage);
    }

    /**
     * POST /api/reservations/request-refund/{id}
     */
    @PostMapping({"/reservations/request-refund/{id}", "/v1/vendor/reservations/request-refund/{id}"})
    public ResponseEntity<Void> requestRefund(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt,
            Principal principal,
            @RequestParam(required = false, defaultValue = "Vendor requested refund") String reason) {
        String username = getAuthenticatedUsername(jwt, principal);
        reservationService.requestRefund(id, username, reason);
        return ResponseEntity.ok().build();
    }

    /**
     * Maps a Reservation entity to a ReservationResponse DTO.
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
                    r.getUser().getCategories() != null ? r.getUser().getCategories().stream().map(Enum::name).collect(Collectors.toList()) : null
            ));
        }

        if (r.getEventStall() != null) {
            if (r.getEventStall().getStallTemplate() != null) {
                String tempName = r.getEventStall().getStallTemplate().getName();
                res.setStalls(java.util.Collections.singletonList(tempName));

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
}
