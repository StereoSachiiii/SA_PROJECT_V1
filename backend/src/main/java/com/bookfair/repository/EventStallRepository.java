package com.bookfair.repository;

import com.bookfair.entity.EventStall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventStallRepository extends JpaRepository<EventStall, Long> {

    // Get all stalls allocated to a specific event
    List<EventStall> findByEventId(Long eventId);

    // Get all stalls for an event that are NOT yet booked
    // Note: We check if there is NO reservation with status 'PAID' or 'PENDING_PAYMENT'
    @Query("SELECT es FROM EventStall es WHERE es.event.id = :eventId AND es.id NOT IN " +
           "(SELECT r.eventStall.id FROM Reservation r WHERE r.status IN ('PAID', 'PENDING_PAYMENT', 'CHECKED_IN'))")
    List<EventStall> findAvailableByEventId(Long eventId);
}