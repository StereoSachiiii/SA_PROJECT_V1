package com.bookfair.entity;

import java.time.LocalDateTime;

import com.bookfair.entity.enums.StallSize;
import com.bookfair.entity.enums.StallType;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class StallTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hall_id", nullable = false)
    private Hall hall;
    
    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private StallSize size;

    @Enumerated(EnumType.STRING)
    private StallType type;

    private Integer defaultProximityScore;

    // Stores coordinates/rotation for the map (e.g., {x: 10, y: 20, r: 90})
    @Column(columnDefinition = "jsonb")
    private String geometry;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
}
