package com.bookfair.controller;

import com.bookfair.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/email")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class EmailController {

    private final EmailService emailService;

    @GetMapping("/test")
    public String sendTest(@RequestParam String to) {
        emailService.sendTestEmail(to);
        return "Test email sent to " + to;
    }
}
