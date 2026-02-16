package com.bookfair.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {
    // Spring Boot auto-configuration for RedisCacheManager will take over
    // based on the properties in application.properties.
}
