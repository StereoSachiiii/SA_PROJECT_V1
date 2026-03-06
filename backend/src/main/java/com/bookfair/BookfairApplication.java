package com.bookfair;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@EnableScheduling
@Slf4j
public class BookfairApplication {
    public static void main(String[] args) {
        // Load .env file
        try {
            Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
            dotenv.entries().forEach(entry -> {
                System.setProperty(entry.getKey(), entry.getValue());
                log.info("Loaded env var: " + entry.getKey());
            });
            log.info("Dotenv loaded successfully.");
        } catch (Exception e) {
            log.error("Could not load .env file: {}", e.getMessage());
        }

        SpringApplication.run(BookfairApplication.class, args);
    }
}
