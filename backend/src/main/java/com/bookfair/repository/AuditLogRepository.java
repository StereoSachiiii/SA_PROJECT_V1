package com.bookfair.repository;

import com.bookfair.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByActorId(Long actorId);
    List<AuditLog> findByEntityTypeAndEntityId(String entityType, Long entityId);

    Page<AuditLog> findByEntityType(String entityType, Pageable pageable);
    Page<AuditLog> findByActor_Id(Long actorId, Pageable pageable);

    @Query("SELECT a FROM AuditLog a LEFT JOIN a.actor u WHERE (:entityType IS NULL OR a.entityType = :entityType) AND (:actorId IS NULL OR u.id = :actorId) ORDER BY a.timestamp DESC")
    Page<AuditLog> findFiltered(
        @org.springframework.data.repository.query.Param("entityType") String entityType,
        @org.springframework.data.repository.query.Param("actorId") Long actorId,
        Pageable pageable);
}
