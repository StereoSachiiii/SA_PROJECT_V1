package com.bookfair.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Represents a physical stall at the Colombo International Bookfair.
 *
 * Stalls are positioned on a grid-based venue map and categorized by size.
 * Availability is derived from the Reservation table (no redundant boolean flag).
 * The grid position (positionX, positionY) + span (colSpan, rowSpan) determines
 * where and how large the stall renders on the frontend map.
 */
@Entity
@Table(name = "stalls", indexes = {
    @Index(name = "idx_stalls_position", columnList = "positionX, positionY"),
    @Index(name = "idx_stalls_name", columnList = "name")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Stall {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /** Alphabetic stall name, e.g. "A1", "B3", "C5". Unique identifier for display. */
    @Column(nullable = false, unique = true)
    private String name;
    
    /** Size category: SMALL, MEDIUM, or LARGE. Determines default dimensions. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StallSize size;
    
    /** Stall width in grid units (e.g., SMALL=1, MEDIUM=2, LARGE=2). */
    @Column(nullable = false)
    private Integer width = 1;
    
    /** Stall height in grid units (e.g., SMALL=1, MEDIUM=1, LARGE=2). */
    @Column(nullable = false)
    private Integer height = 1;
    
    /** Grid column position on the venue map (0-indexed). */
    @Column(nullable = false)
    private Integer positionX;
    
    /** Grid row position on the venue map (0-indexed). */
    @Column(nullable = false)
    private Integer positionY;
    
    /** Number of grid columns this stall spans (default 1). */
    @Column(nullable = false)
    private Integer colSpan = 1;
    
    /** Number of grid rows this stall spans (default 1). */
    @Column(nullable = false)
    private Integer rowSpan = 1;
    
    /** Price in cents to avoid floating-point issues (e.g., 500000 = LKR 5000.00). */
    private Integer priceCents;
    
    public enum StallSize {
        SMALL, MEDIUM, LARGE
    }
}
