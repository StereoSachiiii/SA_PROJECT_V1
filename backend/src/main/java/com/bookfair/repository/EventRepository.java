package com.bookfair.repository;

import com.bookfair.entity.Event;
import com.bookfair.entity.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Find active events for the public API
    List<Event> findByStatus(EventStatus status);
    
    // Find events happening within a specific date range
    // useful for admin dashboards
    List<Event> findByStartDateAfter(java.time.LocalDateTime date);
}