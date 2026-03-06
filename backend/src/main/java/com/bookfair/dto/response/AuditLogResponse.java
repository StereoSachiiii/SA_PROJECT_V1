package com.bookfair.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuditLogResponse {
    private Long id;
    private Long actorId;
    private String action;
    private String entityType;
    private Long entityId;
    private String timestamp;
    private String changeDescription;
}
