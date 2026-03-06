package com.bookfair.repository;

import com.bookfair.entity.PhysicalConstraint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhysicalConstraintRepository extends JpaRepository<PhysicalConstraint, Long> {
    List<PhysicalConstraint> findByHallId(Long hallId);
    void deleteByHallId(Long hallId);
}
