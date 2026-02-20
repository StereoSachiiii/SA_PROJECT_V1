package com.bookfair.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * Represents a registered user — either a VENDOR (book publisher) or ADMIN (employee/organizer).
 *
 * Vendors register via the online portal and can reserve up to 3 stalls.
 * Admins access the employee-only portal to view reservations and stall availability.
 */
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_users_username", columnList = "username"),
    @Index(name = "idx_users_email", columnList = "email"),
    @Index(name = "idx_users_business", columnList = "businessName")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    /** Business/publisher name. used for the 3-stall-per-business limit. */
    private String businessName;
    
    @Column(columnDefinition = "TEXT")
    private String businessDescription;
    
    private String logoUrl;
    
    private String contactNumber;
    
    private String address;

    @ElementCollection(targetClass = PublisherCategory.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "user_categories", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private java.util.Set<PublisherCategory> categories;

    /** 
     * Atomic counter for active reservations (PENDING + PAID + CHECKED_IN).
     * Enforced by service layer and checked in atomic transactions.
     * Limit: 3 per vendor.
     */
    private Integer reservedStallsCount = 0;

    private LocalDateTime deletedAt;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Reservation> reservations;
    
    /** Auto-set createdAt and updatedAt on first persist. */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.reservedStallsCount == null) {
            this.reservedStallsCount = 0;
        }
    }
    
    /** Auto-update updatedAt on every update. */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    public enum Role {
        ADMIN, VENDOR, EMPLOYEE
    }
}

