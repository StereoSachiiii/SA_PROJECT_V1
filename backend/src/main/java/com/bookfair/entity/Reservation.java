package com.bookfair.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Represents a stall reservation made by a vendor/publisher.
 *
 * Links a User to a Stall with a unique QR code that acts as an entry pass.
 * Tracks reservation status (CONFIRMED/CANCELLED) and email delivery.
 */
@Entity
@Table(name = "reservations", indexes = {
    @Index(name = "idx_reservations_user", columnList = "user_id"),
    @Index(name = "idx_reservations_stall", columnList = "event_stall_id"),
    @Index(name = "idx_reservations_status", columnList = "status"),
    @Index(name = "idx_reservations_qr", columnList = "qrCode")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The vendor/publisher who made this reservation. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** The stall being reserved (Event specific). Can be null if generic reservation. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_stall_id", nullable = true)
    private EventStall eventStall;

    @Column(name = "event_name")
    private String eventName;

    @Column(name = "reservation_date")
    private LocalDate reservationDate;

    @Column(name = "stall_type")
    private String stallType;

    @Column(name = "stall_size")
    private String stallSize;

    @Column(name = "stall_count")
    private Integer stallCount;

    @Column(name = "business_category")
    private String businessCategory;

    @Column(name = "special_comments", length = 500)
    private String specialComments;

    /** Unique QR code string — acts as an entry pass to the exhibition. */
    @Column(name = "payment_id")
    private String paymentId;

    @Column(name = "qr_code", unique = true)
    private String qrCode;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status = ReservationStatus.PENDING_PAYMENT;

    /** Whether the confirmation email has been successfully sent. */
    @Builder.Default
    @Column(nullable = false)
    private Boolean emailSent = false;

    /** Timestamp when the reservation was created. Set automatically by @PrePersist. */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum ReservationStatus {
        PENDING_PAYMENT,
        PAID,
        CANCELLED,
        EXPIRED,
        PENDING_REFUND
    }
}
