package com.bookfair.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for broadcasting real-time stall updates via WebSocket.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StallUpdateMessage {
    private Long stallId;
    private boolean reserved;
    private String occupiedBy;
    private String publisherCategory;
}
