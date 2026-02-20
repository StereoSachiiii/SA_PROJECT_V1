package com.bookfair.service;

import com.bookfair.entity.*;
import com.bookfair.repository.EventStallRepository;
import com.bookfair.repository.HallRepository;
import com.bookfair.repository.StallTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bookfair.exception.ResourceNotFoundException;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminStallService {

    private final StallTemplateRepository stallTemplateRepository;
    private final EventStallRepository eventStallRepository;
    private final HallRepository hallRepository;

    @Transactional
    public List<StallTemplate> bulkGenerateStalls(Long hallId, int count, StallSize size, StallCategory category, Long basePriceCents) {
        Hall hall = hallRepository.findById(hallId)
                .orElseThrow(() -> new ResourceNotFoundException("Hall not found"));

        List<StallTemplate> newStalls = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            String name = String.format("%s-%s-%03d", hall.getName(), size, i);
            StallTemplate template = StallTemplate.builder()
                    .hall(hall)
                    .name(name)
                    .size(size)
                    .type(StallType.STANDARD)
                    .category(category)
                    .basePriceCents(basePriceCents)
                    .sqFt(calculateDefaultSqFt(size))
                    .isAvailable(true)
                    .defaultProximityScore(50)
                    .build();
            newStalls.add(template);
        }
        return stallTemplateRepository.saveAll(newStalls);
    }

    private Double calculateDefaultSqFt(StallSize size) {
        switch (size) {
            case SMALL:  return 20.0;
            case MEDIUM: return 50.0;
            case LARGE:  return 100.0;
            default:     return 0.0;
        }
    }

    @Transactional
    public void applyBulkPriceIncrease(Long hallId, double percentage) {
        List<StallTemplate> stalls = stallTemplateRepository.findByHall_Id(hallId);
        stalls.forEach(s -> {
            if (s.getBasePriceCents() != null) {
                long newPrice = (long) (s.getBasePriceCents() * (1 + percentage / 100.0));
                s.setBasePriceCents(newPrice);
            }
        });
        stallTemplateRepository.saveAll(stalls);
    }

    @Transactional(readOnly = true)
    public List<StallTemplate> getStallsByHall(Long hallId) {
        return stallTemplateRepository.findByHall_Id(hallId);
    }

    /** Toggle stall availability (block / unblock) */
    @Transactional
    public StallTemplate setStallAvailability(Long stallId, boolean available) {
        StallTemplate stall = stallTemplateRepository.findById(stallId)
                .orElseThrow(() -> new ResourceNotFoundException("Stall not found: " + stallId));
        stall.setIsAvailable(available);
        return stallTemplateRepository.save(stall);
    }

    /** Export stall inventory as CSV bytes */
    @Transactional(readOnly = true)
    public byte[] exportStallsCsv(Long hallId) {
        List<StallTemplate> stalls = stallTemplateRepository.findByHall_Id(hallId);
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Name,Size,Category,BasePriceLKR,SqFt,Available\n");
        for (StallTemplate s : stalls) {
            sb.append(s.getId()).append(',')
              .append(s.getName()).append(',')
              .append(s.getSize()).append(',')
              .append(s.getCategory()).append(',')
              .append(s.getBasePriceCents() != null ? s.getBasePriceCents() / 100.0 : 0).append(',')
              .append(s.getSqFt()).append(',')
              .append(s.getIsAvailable()).append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }
}
