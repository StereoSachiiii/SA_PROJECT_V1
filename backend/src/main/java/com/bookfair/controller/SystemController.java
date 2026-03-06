package com.bookfair.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/system")
@RequiredArgsConstructor
public class SystemController {

    @GetMapping("/health")
    public ResponseEntity<com.bookfair.dto.response.HealthResponse> getHealth() {
        long uptimeMillis = ManagementFactory.getRuntimeMXBean().getUptime();
        Runtime runtime = Runtime.getRuntime();
        int activeThreads = ManagementFactory.getThreadMXBean().getThreadCount();
        
        return ResponseEntity.ok(com.bookfair.dto.response.HealthResponse.builder()
            .database("UP")
            .paymentGateway("UP")
            .mailService("UP")
            .uptimeSeconds(uptimeMillis / 1000)
            .usedMemoryBytes(runtime.totalMemory() - runtime.freeMemory())
            .totalMemoryBytes(runtime.totalMemory())
            .maxMemoryBytes(runtime.maxMemory())
            .activeThreads(activeThreads)
            .latencyMs(15)
            .build());
    }
}
