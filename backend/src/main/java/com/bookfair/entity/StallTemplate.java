package com.bookfair.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;

@Entity
@Table(name = "stall_templates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE stall_templates SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class StallTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hall_id", nullable = false)
    private Hall hall;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StallSize size;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StallType type;

    @Enumerated(EnumType.STRING)
    private StallCategory category;

    private Double sqFt;

    private Long basePriceCents;

    @Column(length = 1000)
    private String imageUrl;

    private Boolean isAvailable = true;

    @Column(nullable = false)
    private Integer defaultProximityScore;

    @Column(columnDefinition = "TEXT")
    private String geometry; // JSON representation

    private LocalDateTime deletedAt;
}
