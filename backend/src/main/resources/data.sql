-- ============================================================================
-- Bookfair Stall Reservation — Seed Data for PostgreSQL
-- ============================================================================
-- Runs after Hibernate creates tables (spring.jpa.defer-datasource-initialization=true)
-- Uses ON CONFLICT to avoid duplicate errors on restart.
-- ============================================================================
-- Column names match Hibernate's SpringPhysicalNamingStrategy:
--   positionX → positionx  (single-char suffix, no underscore)
--   colSpan   → col_span   (multi-char suffix, gets underscore)
-- ============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- Stalls  (4 rows × 5 cols = 20 stalls)
-- Availability is derived from reservations table (no reserved boolean).
-- Sizes: col 1-2 = SMALL (1×1), col 3-4 = MEDIUM (2×1), col 5 = LARGE (2×2)
-- ─────────────────────────────────────────────────────────────────────────────

-- Row A
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('A1', 'SMALL',  1, 1, 0, 0, 1, 1,  500000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('A2', 'SMALL',  1, 1, 1, 0, 1, 1,  500000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('A3', 'MEDIUM', 2, 1, 2, 0, 2, 1, 1000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('A4', 'MEDIUM', 2, 1, 3, 0, 2, 1, 1000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('A5', 'LARGE',  2, 2, 4, 0, 2, 2, 2000000) ON CONFLICT (name) DO NOTHING;

-- Row B
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('B1', 'SMALL',  1, 1, 0, 1, 1, 1,  500000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('B2', 'SMALL',  1, 1, 1, 1, 1, 1,  500000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('B3', 'MEDIUM', 2, 1, 2, 1, 2, 1, 1000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('B4', 'MEDIUM', 2, 1, 3, 1, 2, 1, 1000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('B5', 'LARGE',  2, 2, 4, 1, 2, 2, 2000000) ON CONFLICT (name) DO NOTHING;

-- Row C
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('C1', 'SMALL',  1, 1, 0, 2, 1, 1,  500000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('C2', 'SMALL',  1, 1, 1, 2, 1, 1,  500000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('C3', 'MEDIUM', 2, 1, 2, 2, 2, 1, 1000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('C4', 'MEDIUM', 2, 1, 3, 2, 2, 1, 1000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('C5', 'LARGE',  2, 2, 4, 2, 2, 2, 2000000) ON CONFLICT (name) DO NOTHING;

-- Row D
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('D1', 'SMALL',  1, 1, 0, 3, 1, 1,  500000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('D2', 'SMALL',  1, 1, 1, 3, 1, 1,  500000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('D3', 'MEDIUM', 2, 1, 2, 3, 2, 1, 1000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('D4', 'MEDIUM', 2, 1, 3, 3, 2, 1, 1000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES ('D5', 'LARGE',  2, 2, 4, 3, 2, 2, 2000000) ON CONFLICT (name) DO NOTHING;
