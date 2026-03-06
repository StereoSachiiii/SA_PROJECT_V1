package com.bookfair.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class HelpService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.rag.service-url:http://localhost:8000/query}")
    private String ragServiceUrl;

    public Map<String, Object> askHelp(String query) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("user_query", query);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

            return restTemplate.postForObject(ragServiceUrl, entity, Map.class);
        } catch (Exception e) {
            log.error("Failed to contact RAG service: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("answer", "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.");
            errorResponse.put("error", true);
            return errorResponse;
        }
    }
}
