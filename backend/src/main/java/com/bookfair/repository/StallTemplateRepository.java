
package com.bookfair.repository;

import com.bookfair.entity.StallTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StallTemplateRepository extends JpaRepository<StallTemplate, Long> {
    List<StallTemplate> findByHall_Id(Long hallId);
}
