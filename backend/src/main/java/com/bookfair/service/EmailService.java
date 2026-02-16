package com.bookfair.service;

import com.bookfair.entity.Reservation;
import com.bookfair.exception.BusinessLogicException;

import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Email service for sending reservation confirmations with QR codes.
 * @author Nihadiyan
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final TemplateEngine templateEngine;
    private final JavaMailSender mailSender;
    private final QrService qrService;

    public void sendConfirmation(String to, List<Reservation> reservations) {
       if (to == null || to.trim().isEmpty()) {
           throw new BusinessLogicException("Email recipient cannot be null or empty");
       }

       try {
           Context context = new Context();
           context.setVariable("reservations", reservations);

           String html = templateEngine.process("res_confirmation_email_template.html", context);
           if (html == null) {
               throw new BusinessLogicException("Could not process the email template. Please contact support.");
           }

           String qrData = reservations.stream()
                   .map(res -> res.getQrCode())
                   .collect(Collectors.joining(","));


           MimeMessage mimeMessage = mailSender.createMimeMessage();

           MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

           mimeMessageHelper.setTo(to);


           mimeMessageHelper.setSubject("Book Fair Reservation Confirmation");

           mimeMessageHelper.setText(html, true);

           byte[] qrBytes = qrService.generateQrCode(qrData);
           mimeMessageHelper.addInline("qrCode", new ByteArrayDataSource(qrBytes, "image/png"));

           mailSender.send(mimeMessage);
           log.info("Successfully sent reservation email to: {}", to);
       } catch (BusinessLogicException e) {
           log.error("Email delivery failed to {}. Reason: {}", to, e.getMessage());
           throw e;
       } catch (Exception e) {
           log.error("Failed to send reservation email to: {}", to, e.getMessage());
           throw new BusinessLogicException("Failed to send email confirmation");
       }
    }
}
