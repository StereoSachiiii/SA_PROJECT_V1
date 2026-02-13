package com.bookfair.service;

import com.bookfair.entity.Reservation;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.List;
import java.util.stream.Collectors;

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

    private final TemplateEngine templateEngine;
    private final JavaMailSender mailSender;
    private final QrService qrService;
    
    public void sendConfirmation(String toEmail, List<Reservation> reservations) {
       try {
           Context context = new Context();
           context.setVariable("reservations", reservations);

           String html = templateEngine.process("confirmation", context);

           String qrData = "Reservations: " + reservations.stream()
                   .map(res -> res.getStall().getName())
                   .collect(Collectors.joining(", "));


           MimeMessage mimeMessage = mailSender.createMimeMessage();

           MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);

           mimeMessageHelper.setTo(toEmail);


           mimeMessageHelper.setSubject("Book Fair Reservation Confirmation");

           mimeMessageHelper.setText(html, true);

           byte[] qrBytes = qrService.generateQrCode(qrData);
           mimeMessageHelper.addInline("qrCode", new ByteArrayDataSource(qrBytes, "image/png"));

           mailSender.send(mimeMessage);
       } catch (Exception e) {
           throw new RuntimeException("Failed to send email", e);
       }
    }
}
