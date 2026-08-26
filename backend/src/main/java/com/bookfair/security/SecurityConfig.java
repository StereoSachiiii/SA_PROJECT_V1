package com.bookfair.security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Security Configuration for OAuth2 Resource Server & OAuth2 Client with Asgardeo OIDC.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final RateLimitingFilter rateLimitingFilter;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    /**
     * Custom JwtAuthenticationConverter mapping OIDC claims to ROLE_VENDOR and ROLE_ORGANIZER authorities.
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter defaultAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        defaultAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Collection<GrantedAuthority> authorities = new ArrayList<>();

            List<String> roles = jwt.getClaimAsStringList("roles");
            if (roles == null) {
                roles = jwt.getClaimAsStringList("groups");
            }
            if (roles != null) {
                for (String role : roles) {
                    String upperRole = role.toUpperCase();
                    if (upperRole.contains("ORGANIZER") || upperRole.contains("ADMIN")) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_ORGANIZER"));
                    } else if (upperRole.contains("VENDOR")) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_VENDOR"));
                    } else {
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + upperRole.replace("ROLE_", "")));
                    }
                }
            }

            Collection<GrantedAuthority> defaults = defaultAuthoritiesConverter.convert(jwt);
            if (defaults != null) {
                authorities.addAll(defaults);
            }

            return authorities;
        });

        return converter;
    }

    /**
     * OIDC Client Initiated Logout Handler redirecting to frontend post-logout URL.
     */
    @Bean
    public OidcClientInitiatedLogoutSuccessHandler oidcLogoutSuccessHandler(ClientRegistrationRepository clientRegistrationRepository) {
        OidcClientInitiatedLogoutSuccessHandler successHandler = new OidcClientInitiatedLogoutSuccessHandler(clientRegistrationRepository);
        successHandler.setPostLogoutRedirectUri(frontendUrl);
        return successHandler;
    }

    /**
     * Configure Security Filter Chain with OAuth2 Resource Server (JWT) and OAuth2 Client (OIDC).
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, ClientRegistrationRepository clientRegistrationRepository) throws Exception {
        http
            .cors(cors -> {})
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/public/**", "/api/v1/public/**", "/api/email/**", "/error", "/login/**", "/oauth2/**").permitAll()
                // Admin / Organizer endpoints
                .requestMatchers("/api/admin/**", "/api/v1/admin/**", "/api/v1/system/**").hasRole("ORGANIZER")
                // Vendor and reservation endpoints (requires VENDOR or ORGANIZER)
                .requestMatchers("/api/vendor/**", "/api/v1/vendor/**", "/api/reservations/**", "/api/v1/reservations/**", "/api/profile", "/api/v1/auth/**").hasAnyRole("VENDOR", "ORGANIZER")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            )
            .oauth2Login(oauth2 -> {})
            .logout(logout -> logout
                .logoutSuccessHandler(oidcLogoutSuccessHandler(clientRegistrationRepository))
            )
            .headers(headers -> headers
                .contentTypeOptions(contentType -> {})
                .frameOptions(frame -> frame.deny())
                .httpStrictTransportSecurity(hsts -> hsts
                    .includeSubDomains(true)
                    .maxAgeInSeconds(31536000)
                )
            );

        http.addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
