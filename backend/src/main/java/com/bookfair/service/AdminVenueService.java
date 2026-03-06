package com.bookfair.service;

import com.bookfair.entity.Building;
import com.bookfair.entity.Venue;
import com.bookfair.entity.Hall;
import com.bookfair.repository.VenueRepository;
import com.bookfair.repository.BuildingRepository;
import com.bookfair.repository.HallRepository;
import com.bookfair.mapper.AdminMapper;
import com.bookfair.dto.response.VenueAdminResponse;
import com.bookfair.dto.response.BuildingAdminResponse;
import com.bookfair.dto.response.HallResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminVenueService {

    private final VenueRepository venueRepository;
    private final BuildingRepository buildingRepository;
    private final HallRepository hallRepository;
    private final AdminMapper adminMapper;

    @Transactional(readOnly = true)
    public List<VenueAdminResponse> getAllVenues() {
        return venueRepository.findAll().stream()
                .map(adminMapper::mapToVenueAdminResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BuildingAdminResponse> getBuildingsByVenue(Long venueId) {
        return buildingRepository.findByVenue_Id(venueId).stream()
                .map(adminMapper::mapToBuildingAdminResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HallResponse> getHallsByBuilding(Long buildingId) {
        return hallRepository.findByBuilding_Id(buildingId).stream()
                .map(adminMapper::mapToHallResponse)
                .collect(Collectors.toList());
    }
}
