package com.bookfair.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import com.bookfair.entity.enums.PublisherCategory;

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
@SQLDelete(sql = "UPDATE users SET deleted_at = NOW() WHERE id = ?")
@Where(clause = "deleted_at IS NULL")
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
    
    /** Business/publisher name. Nullable for ADMIN users. Used for the 3-stall-per-business limit. */
    private String businessName;
    
    private String contactNumber;
    
    private String address;

    @Column(name = "business_description", columnDefinition = "text")
    private String businessDescription;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "reserved_stalls_count", nullable = false)
    private Integer reservedStallsCount = 0;

    @ElementCollection(targetClass = PublisherCategory.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "user_publisher_categories", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private Set<PublisherCategory> publisherCategories;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Reservation> reservations;
    
    /** Auto-set createdAt and updatedAt on first persist. */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.reservedStallsCount == null) this.reservedStallsCount = 0;
    }
    
    /** Auto-update updatedAt on every update. */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    public enum Role {
        ADMIN, EMPLOYEE, VENDOR
    }
}
