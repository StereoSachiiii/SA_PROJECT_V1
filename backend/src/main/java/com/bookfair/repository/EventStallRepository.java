
package com.bookfair.repository;

import com.bookfair.entity.Event;
import com.bookfair.entity.EventStall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventStallRepository extends JpaRepository<EventStall, Long> {
    List<EventStall> findByEvent_Id(Long eventId);
    void deleteByEvent_Id(Long eventId);
}
