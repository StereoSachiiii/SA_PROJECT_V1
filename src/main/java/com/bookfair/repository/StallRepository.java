package com.bookfair.repository;

import com.bookfair.entity.Stall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for stall queries.
 *
 * Availability is derived from the reservations table via LEFT JOIN —
 * a stall is "available" if no CONFIRMED reservation exists for it.
 */
@Repository
public interface StallRepository extends JpaRepository<Stall, Long> {

    /** Find all stalls that have NO confirmed reservation (available for booking). */
    @Query("SELECT s FROM Stall s WHERE s.id NOT IN " +
           "(SELECT r.stall.id FROM Reservation r WHERE r.status = 'CONFIRMED')")
    List<Stall> findAvailable();

    /** Find all stalls that HAVE a confirmed reservation (reserved/grayed out on map). */
    @Query("SELECT s FROM Stall s WHERE s.id IN " +
           "(SELECT r.stall.id FROM Reservation r WHERE r.status = 'CONFIRMED')")
    List<Stall> findReserved();

    /** Find available stalls filtered by size. */
    @Query("SELECT s FROM Stall s WHERE s.size = :size AND s.id NOT IN " +
           "(SELECT r.stall.id FROM Reservation r WHERE r.status = 'CONFIRMED')")
    List<Stall> findAvailableBySize(Stall.StallSize size);

    /** Count how many stalls are currently reserved (for dashboard). */
    @Query("SELECT COUNT(DISTINCT r.stall.id) FROM Reservation r WHERE r.status = 'CONFIRMED'")
    long countReserved();

    List<Stall> findBySize(Stall.StallSize size);
}
