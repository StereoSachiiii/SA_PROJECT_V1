package com.bookfair.repository;

import com.bookfair.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findByStatus(Event.EventStatus status);
    List<Event> findAllByStatus(Event.EventStatus status);
    List<Event> findAllByStatusIn(List<Event.EventStatus> statuses);
    java.util.Optional<Event> findByName(String name);
}
