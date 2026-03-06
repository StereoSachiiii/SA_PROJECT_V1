package com.bookfair.service;

import com.bookfair.entity.EventStall;
import com.bookfair.entity.EventStallStatus;
import com.bookfair.features.reservation.Reservation;
import com.bookfair.features.reservation.ReservationRepository;
import com.bookfair.repository.EventStallRepository;
import com.bookfair.exception.BadRequestException;
import com.bookfair.exception.ResourceNotFoundException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Refund;
import com.stripe.param.RefundCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminReservationService {

    private final ReservationRepository reservationRepository;
    private final EventStallRepository eventStallRepository;
    private final AuditLogService auditLogService;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    @Transactional(readOnly = true)
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Reservation> getPendingRefunds() {
        return reservationRepository.findByStatus(Reservation.ReservationStatus.PENDING_REFUND);
    }

    @Transactional(readOnly = true)
    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + id));
    }

    @Transactional
    public void adminConfirmPayment(Long reservationId) {
        Reservation res = getReservationById(reservationId);
        if (res.getStatus() != Reservation.ReservationStatus.PENDING_PAYMENT) {
            throw new BadRequestException("Reservation is not in PENDING_PAYMENT status");
        }
        res.setStatus(Reservation.ReservationStatus.PAID);
        reservationRepository.save(res);
        auditLogService.logAudit("ADMIN_CONFIRM_PAYMENT", "RESERVATION", reservationId, "Manual payment confirmation by admin");
    }

    @Transactional
    public void adminCancelReservation(Long reservationId, String reason) {
        Reservation res = getReservationById(reservationId);
        if (res.getStatus() == Reservation.ReservationStatus.CANCELLED) {
            throw new BadRequestException("Reservation is already cancelled");
        }
        
        EventStall stall = res.getEventStall();
        if (stall != null) {
            stall.setStatus(EventStallStatus.AVAILABLE);
            eventStallRepository.save(stall);
        }

        res.setStatus(Reservation.ReservationStatus.CANCELLED);
        reservationRepository.save(res);
        auditLogService.logAudit("ADMIN_CANCEL_RESERVATION", "RESERVATION", reservationId, Map.of("reason", reason != null ? reason : ""));
    }

    @Transactional(readOnly = true)
    public byte[] exportReservationsCsv() {
        List<Reservation> reservations = reservationRepository.findAll();
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Vendor,Email,QRCode,Status,TotalLKR,CreatedAt\n");
        for (Reservation r : reservations) {
            sb.append(r.getId()).append(',')
              .append(r.getUser() != null ? r.getUser().getUsername() : "").append(',')
              .append(r.getUser() != null ? r.getUser().getEmail() : "").append(',')
              .append(r.getQrCode()).append(',')
              .append(r.getStatus()).append(',')
              .append(r.getEventStall() != null && r.getEventStall().getFinalPriceCents() != null ? r.getEventStall().getFinalPriceCents() : 0).append(',')
              .append(r.getCreatedAt()).append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Transactional
    public String refundReservation(Long reservationId, String reason) {
        Reservation reservation = getReservationById(reservationId);
        
        if (reservation.getStatus() != Reservation.ReservationStatus.PENDING_REFUND &&
            reservation.getStatus() != Reservation.ReservationStatus.PAID) {
            throw new BadRequestException("Only PAID or PENDING_REFUND reservations can be refunded.");
        }

        // --- STRIPE TEST-MODE REFUND ---
        // If the reservation was paid online, paymentId holds the Stripe PaymentIntent ID.
        // We issue a real Stripe refund (test mode) so the refund appears in the Stripe dashboard.
        String stripeRefundId = null;
        String paymentId = reservation.getPaymentId();

        if (paymentId != null && !paymentId.isBlank()) {
            try {
                RefundCreateParams params = RefundCreateParams.builder()
                        .setPaymentIntent(paymentId)
                        .putMetadata("reservation_id", reservationId.toString())
                        .putMetadata("reason", reason != null ? reason : "Admin initiated refund")
                        .build();
                Refund refund = Refund.create(params);
                stripeRefundId = refund.getId();
                log.info("Stripe refund created: {} for reservation: {}", stripeRefundId, reservationId);
            } catch (StripeException e) {
                log.error("Stripe refund failed for reservation {}: {}", reservationId, e.getMessage());
                // Don't block the refund process — log the stripe failure but proceed with DB state update
                stripeRefundId = "STRIPE_ERROR_" + reservationId;
            }
        } else {
            // No Stripe paymentId (manually confirmed by admin) — issue a simulated refund reference
            stripeRefundId = "MANUAL-" + reservationId;
            log.info("No Stripe payment ID found for reservation {}. Issuing manual refund reference: {}", reservationId, stripeRefundId);
        }

        // Release the stall back to available
        EventStall stall = reservation.getEventStall();
        if (stall != null) {
            stall.setStatus(EventStallStatus.AVAILABLE);
            eventStallRepository.save(stall);
        }

        reservation.setStatus(Reservation.ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);

        // Persist the Stripe refund ID in the audit log
        auditLogService.logAudit("REFUND_ISSUED", "RESERVATION", reservationId, Map.of(
            "reason", reason != null ? reason : "",
            "stripeRefundId", stripeRefundId
        ));
        
        return stripeRefundId;
    }
}
