package com.bookfair.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HealthResponse {
    private String database;
    private String paymentGateway;
    private String mailService;
    private long uptimeSeconds;
    private long usedMemoryBytes;
    private long totalMemoryBytes;
    private long maxMemoryBytes;
    private int activeThreads;
    private int latencyMs;
}
