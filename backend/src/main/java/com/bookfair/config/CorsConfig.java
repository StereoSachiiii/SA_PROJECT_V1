package com.bookfair.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

/**
 * CORS Configuration conforming strictly to OWASP guidelines.
 * Disallows wildcard origins (*) when allowCredentials(true) is set.
 * Restricts allowed origins, HTTP methods, and headers to trusted values.
 */
@Configuration
public class CorsConfig {

    @Value("${app.frontend.url:https://localhost:5173}")
    private String allowedOrigin;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Explicit allowed origins (no wildcard '*')
        List<String> origins = Arrays.asList(
                allowedOrigin,
                "https://localhost:5173",
                "http://localhost:5173",
                "https://localhost:8443",
                "http://localhost:8443"
        );

        for (String origin : origins) {
            if (origin != null && !origin.isBlank() && !config.getAllowedOrigins().contains(origin)) {
                config.addAllowedOrigin(origin);
            }
        }

        config.setAllowCredentials(true);

        // Restrict allowed HTTP methods
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // Restrict allowed headers
        config.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));

        config.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Disposition"
        ));

        config.setMaxAge(3600L); // Cache preflight response for 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        source.registerCorsConfiguration("/v1/**", config);
        return new CorsFilter(source);
    }
}
