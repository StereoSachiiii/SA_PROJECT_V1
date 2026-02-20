package com.bookfair.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_stalls", 
    uniqueConstraints = @UniqueConstraint(columnNames = {"event_id", "template_id"}),
    indexes = {
        @Index(name = "idx_event_stalls_event", columnList = "event_id"),
        @Index(name = "idx_event_stalls_template", columnList = "template_id")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE event_stalls SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class EventStall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private StallTemplate stallTemplate;

    @Column(nullable = false)
    private Long baseRateCents;

    @Column(nullable = false)
    @Builder.Default
    private Double multiplier = 1.0;

    @Column(nullable = false)
    @Builder.Default
    private Long proximityBonusCents = 0L;

    @Column(nullable = false)
    private Long finalPriceCents;

    @Enumerated(EnumType.STRING)
    private EventStallStatus status = EventStallStatus.AVAILABLE;

    private String pricingVersion;

    @Column(columnDefinition = "TEXT")
    private String geometry; // JSON: { "x": 10, "y": 20, "w": 5, "h": 5 }

    private LocalDateTime deletedAt;
}
