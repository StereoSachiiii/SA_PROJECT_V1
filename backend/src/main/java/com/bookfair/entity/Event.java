package com.bookfair.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Event entity representing a book fair exhibition.
 */
@Entity
@Table(name = "events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "stalls", "zones", "influences"})
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    @Column(nullable = false)
    private String location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id")
    private Venue venue;

    @Column(columnDefinition = "TEXT")
    private String mapUrl;
    private Double mapWidth;
    private Double mapHeight;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<EventStall> stalls;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<MapZone> zones;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<MapInfluence> influences;


    @Enumerated(EnumType.STRING)
    private EventStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = EventStatus.UPCOMING;
        }
    }

    public enum EventStatus {
        UPCOMING,
        OPEN,
        CLOSED,
        COMPLETED,
        CANCELLED,
        ARCHIVED
    }
}
