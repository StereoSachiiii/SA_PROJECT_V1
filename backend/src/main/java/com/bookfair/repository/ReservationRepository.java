package com.bookfair.repository;

import com.bookfair.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import org.springframework.lang.NonNull;

/**
 * Repository for reservation queries.
 * Uses JOIN FETCH to eagerly load related Stall and User entities.
 */
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    /** Find all reservations for a specific user (with stall and user data eager-loaded). */
    @Query("SELECT r FROM Reservation r LEFT JOIN FETCH r.eventStall es LEFT JOIN FETCH es.stallTemplate st LEFT JOIN FETCH st.hall h LEFT JOIN FETCH h.building b LEFT JOIN FETCH r.user WHERE r.user.id = :userId")
    List<Reservation> findByUserId(Long userId);

    @Override
    @org.springframework.lang.NonNull
    @Query("SELECT r FROM Reservation r JOIN FETCH r.eventStall JOIN FETCH r.user")
    List<Reservation> findAll();

    @Query("SELECT r FROM Reservation r LEFT JOIN FETCH r.eventStall es LEFT JOIN FETCH es.stallTemplate st LEFT JOIN FETCH st.hall h LEFT JOIN FETCH h.building b LEFT JOIN FETCH r.user WHERE r.id = :id")
    Optional<Reservation> findByIdWithDetails(@org.springframework.data.repository.query.Param("id") Long id);

    /** Find a reservation by its QR code (for entry pass verification). */
    Optional<Reservation> findByQrCode(String qrCode);

    /** Count active reservations for a user (for the max-3-stalls check). Includes PENDING and PAID. */
    /** Count active reservations for a user (for the max-3-stalls check). Includes PENDING_PAYMENT and PAID. */
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.user.id = :userId AND (r.status = 'PAID' OR r.status = 'PENDING_PAYMENT')")
    long countByUserIdAndStatusActive(Long userId);

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.user.id = :userId AND r.eventStall.event.id = :eventId AND (r.status = 'PAID' OR r.status = 'PENDING_PAYMENT')")
    long countByUserIdAndEventIdAndStatusActive(Long userId, Long eventId);

    /** Check if a stall already has an active reservation. */
    @Query("SELECT COUNT(r) > 0 FROM Reservation r WHERE r.eventStall.id = :stallId AND (r.status = 'PAID' OR r.status = 'PENDING_PAYMENT')")
    boolean isStallReserved(Long stallId);

    @Query("SELECT COALESCE(SUM(r.eventStall.finalPriceCents), 0) FROM Reservation r WHERE r.status = 'PAID'")
    long sumTotalRevenueCents();

    @Query("SELECT COUNT(DISTINCT r.user.id) FROM Reservation r WHERE r.status = 'PAID' OR r.status = 'PENDING_PAYMENT'")
    long countActiveVendors();

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.status IN :statuses")
    long countByStatusIn(@org.springframework.data.repository.query.Param("statuses") List<Reservation.ReservationStatus> statuses);

    long countByUserId(Long userId);

    @Query("SELECT r FROM Reservation r LEFT JOIN FETCH r.eventStall es LEFT JOIN FETCH es.stallTemplate st LEFT JOIN FETCH st.hall h LEFT JOIN FETCH h.building b LEFT JOIN FETCH r.user WHERE r.eventStall.event.id = :eventId AND (r.status = 'PAID' OR r.status = 'PENDING_PAYMENT')")
    List<Reservation> findActiveByEventId(Long eventId);

    /** Search by vendor business name or username (case-insensitive) with filters */
    @Query("SELECT r FROM Reservation r LEFT JOIN FETCH r.eventStall es LEFT JOIN FETCH es.stallTemplate st LEFT JOIN FETCH st.hall h LEFT JOIN FETCH h.building b LEFT JOIN FETCH r.user " +
           "WHERE (LOWER(r.user.businessName) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(r.user.username) LIKE LOWER(CONCAT('%', :q, '%'))) " +
           "AND (:status IS NULL OR r.status = :status) " +
           "AND (:eventId IS NULL OR r.eventStall.event.id = :eventId)")
    List<Reservation> searchReservations(
            @org.springframework.data.repository.query.Param("q") String q,
            @org.springframework.data.repository.query.Param("status") Reservation.ReservationStatus status,
            @org.springframework.data.repository.query.Param("eventId") Long eventId);

    /** Count reservations that have a check-in log entry */
    @Query("SELECT COUNT(DISTINCT cl.reservation.id) FROM CheckInLog cl")
    long countCheckedIn();
}
