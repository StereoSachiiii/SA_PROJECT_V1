package com.bookfair.mapper;

import com.bookfair.entity.*;
import com.bookfair.dto.request.HallRequest;
import com.bookfair.dto.response.*;
import com.bookfair.repository.BuildingRepository;
import com.bookfair.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AdminMapper {

    private final BuildingRepository buildingRepository;

    public Hall mapToHallEntity(HallRequest req) {
        Hall hall = new Hall();
        hall.setName(req.getName());
        
        if (req.getBuildingId() != null) {
            hall.setBuilding(buildingRepository.findById(req.getBuildingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Building not found ID: " + req.getBuildingId())));
        }
        
        hall.setTotalSqFt(req.getTotalSqFt() != null ? req.getTotalSqFt().doubleValue() : null);
        hall.setCapacity(req.getCapacity());
        if (req.getStatus() != null) hall.setStatus(req.getStatus());
        if (req.getMainCategory() != null) hall.setMainCategory(req.getMainCategory());
        if (req.getTier() != null) hall.setTier(org.apache.commons.lang3.EnumUtils.getEnum(HallTier.class, req.getTier()));
        if (req.getFloorLevel() != null) hall.setFloorLevel(req.getFloorLevel());
        
        hall.setCeilingHeight(req.getCeilingHeight());
        hall.setIsIndoor(req.getIsIndoor());
        hall.setIsAirConditioned(req.getIsAirConditioned());
        hall.setExpectedFootfall(req.getExpectedFootfall());
        hall.setNearbyFacilities(req.getNearbyFacilities());
        hall.setDistanceFromEntrance(req.getDistanceFromEntrance());
        hall.setDistanceFromParking(req.getDistanceFromParking());
        hall.setIsGroundFloor(req.getIsGroundFloor());
        if (req.getNoiseLevel() != null) hall.setNoiseLevel(org.apache.commons.lang3.EnumUtils.getEnum(NoiseLevel.class, req.getNoiseLevel()));
        
        return hall;
    }

    public HallResponse mapToHallResponse(Hall hall) {
        return HallResponse.builder()
                .id(hall.getId())
                .name(hall.getName())
                .venueName(hall.getBuilding() != null && hall.getBuilding().getVenue() != null 
                        ? hall.getBuilding().getVenue().getName() : "")
                .totalSqFt(hall.getTotalSqFt() != null ? hall.getTotalSqFt().intValue() : 0)
                .capacity(hall.getCapacity())
                .tier(hall.getTier() != null ? hall.getTier().name() : null)
                .floorLevel(hall.getFloorLevel())
                .status(hall.getStatus())
                .mainCategory(hall.getMainCategory())
                .ceilingHeight(hall.getCeilingHeight())
                .isIndoor(hall.getIsIndoor())
                .isAirConditioned(hall.getIsAirConditioned())
                .expectedFootfall(hall.getExpectedFootfall())
                .noiseLevel(hall.getNoiseLevel() != null ? hall.getNoiseLevel().name() : null)
                .nearbyFacilities(hall.getNearbyFacilities())
                .distanceFromEntrance(hall.getDistanceFromEntrance())
                .distanceFromParking(hall.getDistanceFromParking())
                .isGroundFloor(hall.getIsGroundFloor())
                .constraints(hall.getConstraints() != null ? hall.getConstraints().stream()
                        .map(c -> PhysicalConstraintResponse.builder()
                                .id(c.getId())
                                .type(c.getType())
                                .posX(c.getPosX())
                                .posY(c.getPosY())
                                .width(c.getWidth())
                                .height(c.getHeight())
                                .label(c.getLabel())
                                .build()).collect(Collectors.toList()) : null)
                .build();
    }

    public StallTemplateResponse mapToStallTemplateResponse(StallTemplate st) {
        return StallTemplateResponse.builder()
                .id(st.getId())
                .name(st.getName())
                .hallName(st.getHall() != null ? st.getHall().getName() : "")
                .size(st.getSize())
                .type(st.getType())
                .category(st.getCategory())
                .basePriceCents(st.getBasePriceCents())
                .sqFt(st.getSqFt())
                .isAvailable(st.getIsAvailable())
                .defaultProximityScore(st.getDefaultProximityScore())
                .posX(st.getPosX())
                .posY(st.getPosY())
                .width(st.getWidth())
                .height(st.getHeight())
                .imageUrl(st.getImageUrl())
                .build();
    }

    public EventStallAdminResponse mapToEventStallAdminResponse(EventStall es) {
        return EventStallAdminResponse.builder()
                .id(es.getId())
                .stallName(es.getStallTemplate() != null ? es.getStallTemplate().getName() : "")
                .status(es.getStatus() != null ? es.getStatus().name() : "")
                .baseRateCents(es.getBaseRateCents())
                .finalPriceCents(es.getFinalPriceCents())
<<<<<<< HEAD
<<<<<<< HEAD
                .posX(es.getPosX())
                .posY(es.getPosY())
                .width(es.getWidth())
                .height(es.getHeight())
=======
=======
>>>>>>> main
                .posX(es.getPosX() != null ? es.getPosX() : (es.getStallTemplate() != null ? es.getStallTemplate().getPosX() : 0.0))
                .posY(es.getPosY() != null ? es.getPosY() : (es.getStallTemplate() != null ? es.getStallTemplate().getPosY() : 0.0))
                .width(es.getWidth() != null ? es.getWidth() : (es.getStallTemplate() != null ? es.getStallTemplate().getWidth() : 8.0))
                .height(es.getHeight() != null ? es.getHeight() : (es.getStallTemplate() != null ? es.getStallTemplate().getHeight() : 8.0))
<<<<<<< HEAD
>>>>>>> main
=======
>>>>>>> main
                .pricingVersion(es.getPricingVersion())
                .build();
    }

    public VenueAdminResponse mapToVenueAdminResponse(Venue v) {
        return VenueAdminResponse.builder()
                .id(v.getId())
                .name(v.getName())
                .address(v.getAddress())
                .buildings(v.getBuildings() != null ? v.getBuildings().stream()
                        .map(this::mapToBuildingAdminResponse)
                        .collect(Collectors.toList()) : null)
                .build();
    }

    public BuildingAdminResponse mapToBuildingAdminResponse(Building b) {
        return BuildingAdminResponse.builder()
                .id(b.getId())
                .name(b.getName())
                .gpsCoordinates(b.getGpsLocation())
                .halls(b.getHalls() != null ? b.getHalls().stream()
                        .map(this::mapToHallResponse)
                        .collect(Collectors.toList()) : null)
                .build();
    }
}
