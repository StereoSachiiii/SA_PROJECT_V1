package com.bookfair.dto.response;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VenueResponse {
    private Long id;
    private String name;
    private String address;
    private List<BuildingResponse> buildings;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BuildingResponse {
        private Long id;
        private String name;
        private String gps;
        private List<HallResponse> halls;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HallResponse {
        private Long id;
        private String name;
        private String category;
    }
}
