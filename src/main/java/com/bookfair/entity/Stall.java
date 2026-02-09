package com.bookfair.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "stalls")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Stall {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name; // A1, A2, B1, etc.
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StallSize size;
    
    @Column(nullable = false)
    private Boolean reserved = false;
    
    private Integer positionX;
    private Integer positionY;
    
    public enum StallSize {
        SMALL, MEDIUM, LARGE
    }
}
