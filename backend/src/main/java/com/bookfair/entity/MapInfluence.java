package com.bookfair.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "map_influences")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MapInfluence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    private String hallName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MapInfluenceType type;

    // Percentage coordinates (0-100)
    private Double posX;
    private Double posY;
    private Double radius;

    private Integer intensity; // 0-100
    
    private String falloff; // e.g., "LINEAR", "EXPONENTIAL"
}
