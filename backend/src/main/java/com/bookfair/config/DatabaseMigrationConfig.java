package com.bookfair.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigrationConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseMigrationConfig.class);
    private final JdbcTemplate jdbcTemplate;

    public DatabaseMigrationConfig(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void runMigrations() {
        logger.info("Executing automatic database migrations...");
        try {
            // Drop the old constraint
            jdbcTemplate.execute("ALTER TABLE reservations DROP CONSTRAINT IF EXISTS reservations_status_check");
            // Add the new constraint with PENDING_REFUND
            jdbcTemplate.execute("ALTER TABLE reservations ADD CONSTRAINT reservations_status_check " +
                    "CHECK (status::text = ANY (ARRAY['PENDING_PAYMENT'::character varying, 'PAID'::character varying, " +
                    "'CANCELLED'::character varying, 'EXPIRED'::character varying, 'CHECKED_IN'::character varying, " +
                    "'PENDING_REFUND'::character varying]::text[]))");
            logger.info("Successfully updated reservations_status_check constraint!");
        } catch (Exception e) {
            logger.warn("Migration failed or already applied: {}", e.getMessage());
        }
    }
}
