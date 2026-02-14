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


@Service
@RequiredArgsConstructor
public class EmailService {

    private final TemplateEngine templateEngine;
    private final JavaMailSender mailSender;
    private final QrService qrService;
    
    public void sendConfirmation(String to, List<Reservation> reservations) {
       try {
           Context context = new Context();
           context.setVariable("reservations", reservations);

           String html = templateEngine.process("res_confirmation_email_template.html", context);

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
       } catch (Exception e) {
           throw new RuntimeException("Failed to send email", e);
       }
    }
}
