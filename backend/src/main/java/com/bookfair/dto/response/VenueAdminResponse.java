package com.bookfair.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VenueAdminResponse {
    private Long id;
    private String name;
    private String address;
    private List<BuildingAdminResponse> buildings;
}
