package com.bookfair.service;

import com.bookfair.entity.Reservation;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Email Notification Service
 * 
 * TODO [BACKEND DEV 2]: Implement email sending with QR attachment
 * 
 * Steps:
 * 1. Inject JavaMailSender (already in pom.xml)
 * 2. Create MimeMessage with HTML body
 * 3. Attach QR code image from QrService
 * 4. Configure SMTP in application.properties
 * 
 * For testing: Use mailtrap.io or console logging
 */
@Service
@RequiredArgsConstructor
public class EmailService {
    
    // TODO: Uncomment when implementing
    // private final JavaMailSender mailSender;
    // private final QrService qrService;
    
    public void sendConfirmation(String toEmail, List<Reservation> reservations) {
        // TODO: Implement email sending
        // For now, just log
        System.out.println("=== EMAIL WOULD BE SENT ===");
        System.out.println("To: " + toEmail);
        System.out.println("Reservations: " + reservations.size());
        reservations.forEach(r -> 
            System.out.println("  - Stall: " + r.getStall().getName() + ", QR: " + r.getQrCode())
        );
        System.out.println("===========================");
    }
}
