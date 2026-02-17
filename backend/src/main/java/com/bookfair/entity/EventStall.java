package com.bookfair.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_stalls", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"event_id", "template_id"}) // Prevent duplicate stalls in one event
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE event_stalls SET deleted_at = NOW() WHERE id = ?")
@Where(clause = "deleted_at IS NULL")
public class EventStall {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private StallTemplate stallTemplate;

    // Pricing Logic
    @Column(nullable = false)
    private Long baseRateCents; // e.g., 500,000 (5,000 LKR)

    @Column(nullable = false)
    private Float multiplier = 1.0f; // e.g., 1.5 for "High Demand"

    @Column(nullable = false)
    private Long proximityBonusCents = 0L; // e.g., +50,000 for near entrance

    @Column(nullable = false)
    private Long finalPriceCents; // Calculated automatically

    @Column(nullable = false)
    private String pricingVersion; // e.g., "V1_EARLY_BIRD"

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    // Auto-calculate price before saving
    @PrePersist
    @PreUpdate
    public void calculateFinalPrice() {
        this.finalPriceCents = (long) (this.baseRateCents * this.multiplier) + this.proximityBonusCents;
    }
}