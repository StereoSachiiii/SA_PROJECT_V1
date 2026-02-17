package com.bookfair.repository;

import com.bookfair.entity.StallTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StallTemplateRepository extends JpaRepository<StallTemplate, Long> {
    
    // Find all templates in a specific hall (e.g., "Hall A")
    List<StallTemplate> findByHallId(Long hallId);
}