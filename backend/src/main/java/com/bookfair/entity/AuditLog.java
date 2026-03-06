package com.bookfair.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id")
    private User actor;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private String entityType;

    private Long entityId;

    /** Stores a human-readable description of the changes (avoiding JSON). */
    @Column(columnDefinition = "TEXT")
    private String changeDescription;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
}
