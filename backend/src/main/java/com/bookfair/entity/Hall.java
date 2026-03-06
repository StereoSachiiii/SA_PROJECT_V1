package com.bookfair.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.util.Set;
import java.time.LocalDateTime;

@Entity
@Table(name = "halls")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Hall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id", nullable = false)
    private Building building;

    @Column(nullable = false)
    private String name;

    private Double totalSqFt;
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    private HallTier tier;

    private Integer floorLevel;

    @Enumerated(EnumType.STRING)
    private HallStatus status;

    // Operational Metadata
    private Double ceilingHeight;
    private Boolean isIndoor;
    private Boolean isAirConditioned;
    private Integer expectedFootfall;

    @Enumerated(EnumType.STRING)
    private NoiseLevel noiseLevel;

    private String nearbyFacilities;
    private Double distanceFromEntrance;
    private Double distanceFromParking;
    private Boolean isGroundFloor;

    @Enumerated(EnumType.STRING)
    private PublisherCategory mainCategory;

    @ElementCollection(targetClass = PublisherCategory.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "hall_allowed_categories", joinColumns = @JoinColumn(name = "hall_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private Set<PublisherCategory> allowedCategories;

    @OneToMany(mappedBy = "hall", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PhysicalConstraint> constraints;

    @OneToMany(mappedBy = "hall", cascade = CascadeType.ALL)
    private List<StallTemplate> stallTemplates;

    private LocalDateTime deletedAt;
}
