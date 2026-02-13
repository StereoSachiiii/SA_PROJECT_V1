package com.bookfair.service;

import com.bookfair.entity.Stall;
import com.bookfair.repository.StallRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StallService {
    
    private final StallRepository stallRepository;
    
    // Initialize sample stalls on startup
    @PostConstruct
    public void initStalls() {
        if (stallRepository.count() == 0) {
            String[] rows = {"A", "B", "C", "D"};
            Stall.StallSize[] sizes = {Stall.StallSize.SMALL, Stall.StallSize.MEDIUM, Stall.StallSize.LARGE};
            
            int id = 0;
            for (int row = 0; row < rows.length; row++) {
                for (int col = 1; col <= 5; col++) {
                    Stall stall = new Stall();
                    stall.setName(rows[row] + col);
                    stall.setSize(sizes[id % 3]);
                    stall.setReserved(false);
                    stall.setPositionX(col);
                    stall.setPositionY(row);
                    stallRepository.save(stall);
                    id++;
                }
            }
        }
    }
    
    public List<Stall> getAll(String sizeStr, Boolean available) {
        if (sizeStr != null && available != null) {
            return stallRepository.findBySizeAndReserved(Stall.StallSize.valueOf(sizeStr.toUpperCase()), !available); // available=true means reserved=false
        } else if (sizeStr != null) {
            return stallRepository.findBySize(Stall.StallSize.valueOf(sizeStr.toUpperCase()));
        } else if (available != null) {
            return stallRepository.findByReserved(!available);
        }
        return stallRepository.findAll();
    }
    
    public List<Stall> getAvailable() {
        return stallRepository.findByReservedFalse();
    }
    
    public Stall getById(Long id) {
        return stallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stall not found"));
    }
}
