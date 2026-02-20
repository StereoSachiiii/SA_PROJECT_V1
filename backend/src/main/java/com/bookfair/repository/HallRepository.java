package com.bookfair.repository;

import com.bookfair.entity.Hall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HallRepository extends JpaRepository<Hall, Long> {
    List<Hall> findByBuildingVenueId(Long venueId);
    List<Hall> findByBuilding_Id(Long buildingId);
}
