package com.bookfair.controller;

import com.bookfair.service.HelpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/public/help")
@RequiredArgsConstructor
public class HelpController {

    private final HelpService helpService;

    @PostMapping("/ask")
    public ResponseEntity<Map<String, Object>> askHelp(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(helpService.askHelp(query));
    }
}
