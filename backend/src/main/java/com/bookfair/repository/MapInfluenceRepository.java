package com.bookfair.repository;

import com.bookfair.entity.MapInfluence;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MapInfluenceRepository extends JpaRepository<MapInfluence, Long> {
    List<MapInfluence> findByEvent_Id(Long eventId);
}
