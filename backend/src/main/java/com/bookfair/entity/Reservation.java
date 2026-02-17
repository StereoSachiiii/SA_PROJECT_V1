package com.bookfair.entity;

import com.bookfair.entity.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

/**
 * Represents a stall reservation made by a vendor/publisher.
 *
 * Links a User to a Stall with a unique QR code that acts as an entry pass.
 * Tracks reservation status (CONFIRMED/CANCELLED) and email delivery.
 * A stall's availability is determined by whether a CONFIRMED reservation exists for it.
 */
@Entity
@Table(name = "reservations", indexes = {
    @Index(name = "idx_reservations_user", columnList = "user_id"),
    @Index(name = "idx_reservations_stall", columnList = "stall_id"),
    @Index(name = "idx_reservations_status", columnList = "status"),
    @Index(name = "idx_reservations_qr", columnList = "qrCode")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE reservations SET deleted_at = NOW() WHERE id = ?")
@Where(clause = "deleted_at IS NULL")
public class Reservation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /** The vendor/publisher who made this reservation. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    /** The stall being reserved. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_stall_id", nullable = false)
    private EventStall eventStall;
    
    /** Unique QR code string — acts as an entry pass to the exhibition. */
    @Column(name = "qr_code", nullable = false, unique = true)
    private String qrCode;
    
    /** Reservation status: CONFIRMED or CANCELLED. Only CONFIRMED counts as "reserved". */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status = ReservationStatus.PENDING_PAYMENT;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id")
    private List<Payment> payments;
    
    /** Whether the confirmation email has been successfully sent. */
    @Column(nullable = false)
    private Boolean emailSent = false;
    
    /** Timestamp when the reservation was created. Set automatically by @PrePersist. */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    
}
