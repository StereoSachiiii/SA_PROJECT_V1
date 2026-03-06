package com.bookfair.service;

import com.bookfair.features.reservation.Reservation;
import com.bookfair.features.reservation.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Scheduled service to send email reminders for upcoming reservations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationReminderService {

    private final ReservationRepository reservationRepository;
    private final EmailService emailService;

    /**
     * Runs every hour to check for reservations starting within the next 7 days.
     * Only sends to PAID reservations that haven't received a reminder yet.
     */
    @Scheduled(cron = "0 0 * * * *") // Every hour
    @Transactional
    public void sendReminders() {
        log.info("Checking for upcoming reservation reminders...");
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nextWeek = now.plusDays(7);
        
        // Find paid reservations for events starting soon
        List<Reservation> upcoming = reservationRepository.findAll().stream()
                .filter(r -> r.getStatus() == Reservation.ReservationStatus.PAID)
                .filter(r -> r.getReminderSentAt() == null)
                .filter(r -> r.getEventStall().getEvent().getStartDate().isBefore(nextWeek))
                .filter(r -> r.getEventStall().getEvent().getStartDate().isAfter(now))
                .toList();

        if (upcoming.isEmpty()) {
            log.info("No upcoming reminders to send.");
            return;
        }

        log.info("Found {} reservations needing reminders.", upcoming.size());

        for (Reservation reservation : upcoming) {
            try {
                emailService.sendReminderEmail(reservation);
                reservation.setReminderSentAt(LocalDateTime.now());
                reservationRepository.save(reservation);
                log.info("Sent reminder for reservation ID: {}", reservation.getId());
            } catch (Exception e) {
                log.error("Failed to send reminder for reservation {}: {}", reservation.getId(), e.getMessage());
            }
        }
    }
}
