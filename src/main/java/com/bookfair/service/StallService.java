package com.bookfair.service;

import com.bookfair.entity.Stall;
import com.bookfair.repository.StallRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service layer for stall operations — querying, filtering, and initialization.
 *
 * Stall availability is derived from the reservations table (no redundant boolean).
 * On first startup, seeds 20 sample stalls if none exist in the database.
 */
@Service
@RequiredArgsConstructor
public class StallService {
    
    private final StallRepository stallRepository;
    
    /**
     * Initialize sample stalls on first startup if the stalls table is empty.
     * Creates a 4-row × 5-column grid with varying sizes:
     * - Positions 1,2: SMALL (1×1) — LKR 5,000
     * - Positions 3,4: MEDIUM (2×1) — LKR 10,000
     * - Position 5: LARGE (2×2) — LKR 20,000
     */
    @PostConstruct
    public void initStalls() {
        if (stallRepository.count() == 0) {
            String[] rows = {"A", "B", "C", "D"};
            
            for (int row = 0; row < rows.length; row++) {
                for (int col = 1; col <= 5; col++) {
                    Stall stall = new Stall();
                    stall.setName(rows[row] + col);
                    stall.setPositionX(col - 1);
                    stall.setPositionY(row);
                    
                    // Size based on column position
                    if (col <= 2) {
                        stall.setSize(Stall.StallSize.SMALL);
                        stall.setWidth(1);
                        stall.setHeight(1);
                        stall.setColSpan(1);
                        stall.setRowSpan(1);
                        stall.setPriceCents(500000); // LKR 5,000.00
                    } else if (col <= 4) {
                        stall.setSize(Stall.StallSize.MEDIUM);
                        stall.setWidth(2);
                        stall.setHeight(1);
                        stall.setColSpan(2);
                        stall.setRowSpan(1);
                        stall.setPriceCents(1000000); // LKR 10,000.00
                    } else {
                        stall.setSize(Stall.StallSize.LARGE);
                        stall.setWidth(2);
                        stall.setHeight(2);
                        stall.setColSpan(2);
                        stall.setRowSpan(2);
                        stall.setPriceCents(2000000); // LKR 20,000.00
                    }
                    
                    stallRepository.save(stall);
                }
            }
        }
    }
    
    /**
     * Get all stalls, optionally filtered by size and/or availability.
     *
     * @param sizeStr   optional size filter ("SMALL", "MEDIUM", "LARGE")
     * @param available optional availability filter (true = not reserved)
     */
    public List<Stall> getAll(String sizeStr, Boolean available) {
        if (sizeStr != null && available != null && available) {
            return stallRepository.findAvailableBySize(Stall.StallSize.valueOf(sizeStr.toUpperCase()));
        } else if (sizeStr != null) {
            return stallRepository.findBySize(Stall.StallSize.valueOf(sizeStr.toUpperCase()));
        } else if (available != null && available) {
            return stallRepository.findAvailable();
        }
        return stallRepository.findAll();
    }
    
    /**
     * Get all available (unreserved) stalls.
     * Availability is derived from the reservations table — no CONFIRMED reservation = available.
     */
    public List<Stall> getAvailable() {
        return stallRepository.findAvailable();
    }
    
    public Stall getById(Long id) {
        return stallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stall not found"));
    }
}
