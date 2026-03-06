package com.bookfair.service;

import com.bookfair.features.reservation.Reservation;
import com.bookfair.features.reservation.ReservationRepository;
import com.bookfair.repository.EventStallRepository;
import com.bookfair.dto.response.AdminDashboardStats;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final ReservationRepository reservationRepository;
    private final EventStallRepository eventStallRepository;

    @Transactional(readOnly = true)
    public AdminDashboardStats getDashboardStats() {
        long totalReservations = reservationRepository.countByStatusIn(List.of(
            Reservation.ReservationStatus.PAID,
            Reservation.ReservationStatus.PENDING_PAYMENT
        ));
        long totalRevenueCents = reservationRepository.sumTotalRevenueCents(Reservation.ReservationStatus.PAID);
        long activeVendors    = reservationRepository.countActiveVendors(
            Reservation.ReservationStatus.PAID, 
            Reservation.ReservationStatus.PENDING_PAYMENT
        );
        long totalStalls      = eventStallRepository.count();
        double fillRate       = totalStalls > 0 ? (double) totalReservations / totalStalls * 100.0 : 0.0;

        log.info("Dashboard Stats: totalReservations={}, totalRevenueCents={}, activeVendors={}, totalStalls={}, fillRate={}", 
            totalReservations, totalRevenueCents, activeVendors, totalStalls, fillRate);

        return AdminDashboardStats.builder()
                .totalReservations(totalReservations)
                .totalRevenueLkr(totalRevenueCents)
                .activeVendors((double)activeVendors)
                .fillRate(fillRate)
                .build();
    }
}
