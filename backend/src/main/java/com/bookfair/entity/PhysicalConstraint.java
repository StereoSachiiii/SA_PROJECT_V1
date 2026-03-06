package com.bookfair.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "physical_constraints")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PhysicalConstraint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hall_id", nullable = false)
    private Hall hall;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PhysicalConstraintType type;

    @Column(nullable = false)
    private Double posX;

    @Column(nullable = false)
    private Double posY;

    @Column(nullable = false)
    private Double width;

    @Column(nullable = false)
    private Double height;

    private String label;
}
