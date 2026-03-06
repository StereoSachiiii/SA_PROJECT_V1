package com.bookfair.repository;

import com.bookfair.entity.CheckInLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CheckInLogRepository extends JpaRepository<CheckInLog, Long> {
    List<CheckInLog> findByReservationId(Long reservationId);
    List<CheckInLog> findByEmployeeId(Long employeeId);
    boolean existsByReservationId(Long reservationId);

    long countByReservation_EventStall_Event_Id(Long eventId);
    List<CheckInLog> findByReservation_EventStall_Event_Id(Long eventId);
}
