package com.bookfair.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_payment_tx", columnList = "transaction_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // In V4, we support atomic batch booking (one payment for multiple reservations).
    // For now, let's keep it simple: One Payment Reference ID per Reservation group.
    // NOTE: The link is usually stored on the Reservation side (reservation.payment_id),
    // or we link this payment to a specific "BookingReference". 
    // To stick to your Schema: RESERVATIONS ||--o{ PAYMENTS
    
    @Column(name = "reservation_group_id") 
    private String reservationGroupId; // Groups multiple reservations paid together

    @Column(name = "transaction_id", unique = true)
    private String transactionId; // From Stripe/PayHere

    @Column(nullable = false)
    private String provider; // "STRIPE", "MANUAL", "PAYHERE"

    @Column(nullable = false)
    private String currency = "LKR";

    @Column(nullable = false)
    private Long amountCents;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Column(name = "failure_reason")
    private String failureReason;

    @Column(nullable = false)
    private LocalDateTime paidAt;

    public enum PaymentStatus {
        SUCCESS, FAILED, REFUNDED
    }
    
    @PrePersist
    protected void onCreate() {
        if (this.paidAt == null) this.paidAt = LocalDateTime.now();
    }
}