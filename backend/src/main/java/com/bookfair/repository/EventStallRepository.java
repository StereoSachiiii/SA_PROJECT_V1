
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

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("SELECT s FROM EventStall s WHERE s.id = :id")
    java.util.Optional<EventStall> findByIdWithLock(@org.springframework.data.repository.query.Param("id") Long id);
}
