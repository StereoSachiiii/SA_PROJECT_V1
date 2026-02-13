package com.bookfair.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Table(name = "publishers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Publisher {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String businessName;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String contactPerson;
    
    @OneToMany(mappedBy = "publisher", cascade = CascadeType.ALL)
    private List<Reservation> reservations;
    
    @OneToMany(mappedBy = "publisher", cascade = CascadeType.ALL)
    private List<Genre> genres;
}
