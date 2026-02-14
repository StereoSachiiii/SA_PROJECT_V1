package com.bookfair.repository;

import com.bookfair.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository for reservation queries.
 * Uses JOIN FETCH to eagerly load related Stall and User entities.
 */
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    /** Find all reservations for a specific user (with stall and user data eager-loaded). */
    @Query("SELECT r FROM Reservation r JOIN FETCH r.stall JOIN FETCH r.user WHERE r.user.id = :userId")
    List<Reservation> findByUserId(Long userId);

    /** Find all reservations (with stall and user data eager-loaded). */
    @Query("SELECT r FROM Reservation r JOIN FETCH r.stall JOIN FETCH r.user")
    List<Reservation> findAll();

    /** Find a reservation by its QR code (for entry pass verification). */
    Optional<Reservation> findByQrCode(String qrCode);

    /** Count confirmed reservations for a user (for the max-3-stalls check). */
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.user.id = :userId AND r.status = 'CONFIRMED'")
    long countByUserIdAndStatusConfirmed(Long userId);

    /** Check if a stall already has a confirmed reservation. */
    @Query("SELECT COUNT(r) > 0 FROM Reservation r WHERE r.stall.id = :stallId AND r.status = 'CONFIRMED'")
    boolean isStallReserved(Long stallId);
}
