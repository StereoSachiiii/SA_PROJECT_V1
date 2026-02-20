package com.bookfair.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DocumentResponse {
    private Long id;
    private String fileName;
    private Long fileSize; // Renamed from size
    private LocalDateTime uploadDate; // Renamed from uploadedAt
}
