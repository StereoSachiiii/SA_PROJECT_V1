package com.bookfair.service;

import com.bookfair.entity.Hall;
import com.bookfair.entity.HallStatus;
import com.bookfair.repository.HallRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bookfair.exception.ResourceNotFoundException;
import com.bookfair.exception.BadRequestException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminHallService {

    private final HallRepository hallRepository;

    @Transactional(readOnly = true)
    public List<Hall> getAllHalls() {
        return hallRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Hall getHallById(Long id) {
        return hallRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hall not found: " + id));
    }

    @Transactional
    public Hall createHall(Hall hall) {
        if (hall.getStatus() == null) {
            hall.setStatus(HallStatus.DRAFT);
        }
        return hallRepository.save(hall);
    }

    @Transactional
    public Hall updateHall(Long id, Hall hallDetails) {
        Hall hall = getHallById(id);

        if (hallDetails.getName() != null) hall.setName(hallDetails.getName());
        if (hallDetails.getTotalSqFt() != null) hall.setTotalSqFt(hallDetails.getTotalSqFt());
        if (hallDetails.getCapacity() != null) hall.setCapacity(hallDetails.getCapacity());
        if (hallDetails.getTier() != null) hall.setTier(hallDetails.getTier());
        if (hallDetails.getFloorLevel() != null) hall.setFloorLevel(hallDetails.getFloorLevel());
        if (hallDetails.getStatus() != null) hall.setStatus(hallDetails.getStatus());

        // Metadata
        if (hallDetails.getCeilingHeight() != null) hall.setCeilingHeight(hallDetails.getCeilingHeight());
        if (hallDetails.getIsIndoor() != null) hall.setIsIndoor(hallDetails.getIsIndoor());
        if (hallDetails.getIsAirConditioned() != null) hall.setIsAirConditioned(hallDetails.getIsAirConditioned());
        if (hallDetails.getExpectedFootfall() != null) hall.setExpectedFootfall(hallDetails.getExpectedFootfall());
        if (hallDetails.getNoiseLevel() != null) hall.setNoiseLevel(hallDetails.getNoiseLevel());
        if (hallDetails.getNearbyFacilities() != null) hall.setNearbyFacilities(hallDetails.getNearbyFacilities());
        if (hallDetails.getDistanceFromEntrance() != null) hall.setDistanceFromEntrance(hallDetails.getDistanceFromEntrance());
        if (hallDetails.getDistanceFromParking() != null) hall.setDistanceFromParking(hallDetails.getDistanceFromParking());
        if (hallDetails.getIsGroundFloor() != null) hall.setIsGroundFloor(hallDetails.getIsGroundFloor());

        return hallRepository.save(hall);
    }

    /** Change hall status to any value (DRAFT / PUBLISHED / ARCHIVED) */
    @Transactional
    public Hall changeStatus(Long id, HallStatus newStatus) {
        Hall hall = getHallById(id);
        hall.setStatus(newStatus);
        return hallRepository.save(hall);
    }

    /** Soft-archive — sets status = ARCHIVED */
    @Transactional
    public void archiveHall(Long id) {
        Hall hall = getHallById(id);
        hall.setStatus(HallStatus.ARCHIVED);
        hallRepository.save(hall);
    }

    /** Hard-delete — only allowed for DRAFT halls to protect live data */
    @Transactional
    public void deleteHall(Long id) {
        Hall hall = getHallById(id);
        if (hall.getStatus() != HallStatus.DRAFT) {
            throw new BadRequestException("Only DRAFT halls can be permanently deleted. Archive it first.");
        }
        hallRepository.delete(hall);
    }
}
