package com.bookfair.service;

import com.bookfair.entity.AuditLog;
import com.bookfair.repository.AuditLogRepository;
import com.bookfair.dto.response.AuditLogResponse;
import com.bookfair.dto.response.PageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public PageResponse<AuditLogResponse> getAuditLogs(String entityType, Long actorId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<AuditLog> result = auditLogRepository.findFiltered(
            entityType != null && !entityType.isEmpty() ? entityType : null,
            actorId,
            pageRequest
        );

        List<AuditLogResponse> content = result.getContent().stream().map(logEntry -> AuditLogResponse.builder()
            .id(logEntry.getId())
            .actorId(logEntry.getActor() != null ? logEntry.getActor().getId() : 0)
            .action(logEntry.getAction())
            .entityType(logEntry.getEntityType())
            .entityId(logEntry.getEntityId() != null ? logEntry.getEntityId() : 0)
            .timestamp(logEntry.getTimestamp().toString())
            .changeDescription(logEntry.getChangeDescription() != null ? logEntry.getChangeDescription() : "")
            .build()).collect(Collectors.toList());

        return PageResponse.<AuditLogResponse>builder()
            .content(content)
            .totalElements(result.getTotalElements())
            .totalPages(result.getTotalPages())
            .size(result.getSize())
            .number(result.getNumber())
            .build();
    }

    @Transactional
    public void logAudit(String action, String entityType, Long entityId, Object detail) {
        try {
            String description = detail != null ? detail.toString() : "No details";
            AuditLog auditLog = AuditLog.builder()
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .changeDescription(description)
                    .build();
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Audit failure: {}", e.getMessage());
        }
    }
}
