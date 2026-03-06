package com.bookfair.controller;

import com.bookfair.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-payment-intent/{reservationId}")
    public ResponseEntity<com.bookfair.dto.response.PaymentIntentResponse> createPaymentIntent(@PathVariable Long reservationId) {
        String clientSecret = paymentService.createPaymentIntent(reservationId);
        return ResponseEntity.ok(com.bookfair.dto.response.PaymentIntentResponse.builder()
                .clientSecret(clientSecret)
                .build());
    }

    @PostMapping("/confirm/{reservationId}")
    public ResponseEntity<com.bookfair.dto.response.PaymentConfirmationResponse> confirmPayment(
            @PathVariable Long reservationId,
            @RequestBody Map<String, String> body) {
        String paymentIntentId = body.get("paymentIntentId");
        paymentService.confirmPayment(reservationId, paymentIntentId);
        return ResponseEntity.ok(com.bookfair.dto.response.PaymentConfirmationResponse.builder()
                .success(true)
                .reservationId(reservationId)
                .build());
    }
}
