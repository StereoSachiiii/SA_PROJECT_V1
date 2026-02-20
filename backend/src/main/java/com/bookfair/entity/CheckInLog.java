package com.bookfair.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "check_in_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckInLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;

    @Column(nullable = false)
    private LocalDateTime checkInTime;

    private String overrideReason;
    
    private String adminOverrideCode;

    @PrePersist
    protected void onCreate() {
        this.checkInTime = LocalDateTime.now();
    }
}
