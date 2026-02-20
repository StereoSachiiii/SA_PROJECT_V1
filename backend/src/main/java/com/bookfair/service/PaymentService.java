package com.bookfair.service;

import com.bookfair.entity.Reservation;
import com.bookfair.exception.ResourceNotFoundException;
import com.bookfair.repository.ReservationRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final ReservationRepository reservationRepository;
    private final ReservationService reservationService;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    /**
     * Create a Stripe PaymentIntent for a specific reservation.
     * This is the first step in the payment flow.
     */
    @Transactional
    public String createPaymentIntent(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));

        if (reservation.getStatus() == Reservation.ReservationStatus.PAID) {
            throw new IllegalStateException("Reservation is already paid");
        }

        // Calculate amount in cents (Stored in LKR in DB)
        long lkrAmountCents = reservation.getEventStall().getFinalPriceCents();
        
        // Stripe Currency Support:
        // We'll try LKR first. If the account doesn't support LKR, we convert to USD at 1USD = 300LKR
        String currency = "usd";
        
        // Forced Conversion to USD since LKR is not available on test account
        long finalAmountCents = Math.max(50L, Math.round(lkrAmountCents / 300.0)); // Stripe minimum is 50 cents USD

        PaymentIntentCreateParams params =
                PaymentIntentCreateParams.builder()
                        .setAmount(finalAmountCents)
                        .setCurrency(currency)
                        .setDescription("Stall Reservation #" + reservation.getId())
                        .putMetadata("reservation_id", reservation.getId().toString())
                        .setAutomaticPaymentMethods(
                                PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                        .setEnabled(true)
                                        .build()
                        )
                        .build();

        try {
            PaymentIntent intent = PaymentIntent.create(params);
            return intent.getClientSecret();
        } catch (StripeException e) {
            log.error("Stripe API error", e);
            throw new com.bookfair.exception.ServiceUnavailableException("Failed to create payment intent", e);
        }
    }

    /**
     * Verifies a PaymentIntent with Stripe and updates the reservation status if successful.
     * This is the secure server-side verification step.
     */
    @Transactional
    public Reservation confirmPayment(Long reservationId, String paymentIntentId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));

        if (reservation.getStatus() == Reservation.ReservationStatus.PAID) {
            return reservation; // Already paid, idempotent success
        }

        try {
            PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
            
            // Verify the intent status is strictly "succeeded"
            if ("succeeded".equals(intent.getStatus())) {
                // Verify the amount matches (to prevent partial payment attacks)
                long expectedUsdCents = Math.max(50L, Math.round(reservation.getEventStall().getFinalPriceCents() / 300.0));
                if (intent.getAmount() < expectedUsdCents) {
                     log.error("Payment amount mismatch! Expected: {}, Got: {}", 
                         expectedUsdCents, intent.getAmount());
                     throw new IllegalStateException("Payment amount insufficient");
                }
                
                // Trigger business logic confirmation (Email, Notifications, Status update)
                reservationService.confirmPayment(reservationId);

                // Refresh object and update stripe payment identifier
                reservation = reservationRepository.findById(reservationId)
                        .orElseThrow(() -> new ResourceNotFoundException("Reservation lost during confirmation"));
                
                reservation.setPaymentId(intent.getId());
                return reservationRepository.save(reservation);
            } else {
                throw new IllegalStateException("Payment not successful. Status: " + intent.getStatus());
            }
            
        } catch (StripeException e) {
            log.error("Stripe verification failed", e);
            throw new com.bookfair.exception.ServiceUnavailableException("Failed to verify payment with Stripe", e);
        }
    }
}
