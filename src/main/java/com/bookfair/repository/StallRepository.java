package com.bookfair.repository;

import com.bookfair.entity.Stall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StallRepository extends JpaRepository<Stall, Long> {
    List<Stall> findByReservedFalse();
    List<Stall> findBySize(Stall.StallSize size);
    List<Stall> findBySizeAndReserved(Stall.StallSize size, Boolean reserved);
    List<Stall> findByReserved(Boolean reserved);
    List<Stall> findByReservedTrue();
}
