package com.bookfair.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @Column(nullable = false, unique = true)
    private String transactionId;

    @Column(nullable = false)
    private Long amountCents;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    private LocalDateTime paidAt;

    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = PaymentStatus.SUCCESS;
        }
        if (paidAt == null && status == PaymentStatus.SUCCESS) {
            paidAt = LocalDateTime.now();
        }
    }

    public enum PaymentStatus {
        SUCCESS, FAILED, REFUNDED
    }
}
