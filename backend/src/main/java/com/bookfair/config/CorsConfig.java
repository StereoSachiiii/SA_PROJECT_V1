package com.bookfair.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * CORS Configuration
 * Allows frontend (localhost:5173) to call this API
 * 
 * normally you only can call this api from you front end or another portal that you use 
 * 
 */
@Configuration
public class CorsConfig {
    
    @org.springframework.beans.factory.annotation.Value("${app.frontend.url}")
    private String allowedOrigin;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin(allowedOrigin); // Use property-verified origin
        config.addAllowedHeader("*");     //allows all header authroization, content-type, etc
        config.addAllowedMethod("*");
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}
