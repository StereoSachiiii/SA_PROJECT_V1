package com.bookfair.repository;

import com.bookfair.entity.MapZone;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MapZoneRepository extends JpaRepository<MapZone, Long> {
    List<MapZone> findByEvent_Id(Long eventId);
}
