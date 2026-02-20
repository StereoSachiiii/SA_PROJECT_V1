package com.bookfair.repository;

import com.bookfair.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {
    java.util.Optional<Venue> findByName(String name);
}
