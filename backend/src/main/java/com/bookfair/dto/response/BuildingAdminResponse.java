package com.bookfair.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BuildingAdminResponse {
    private Long id;
    private String name;
    private String gpsCoordinates;
    private List<HallResponse> halls;
}
