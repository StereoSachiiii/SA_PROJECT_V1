-- ============================================================================
-- Bookfair Stall Reservation — Seed Data for PostgreSQL
-- ============================================================================
-- Runs after Hibernate creates tables (spring.jpa.defer-datasource-initialization=true)
-- Uses ON CONFLICT to avoid duplicate errors on restart.
-- ============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- Stalls  (4 rows × 5 cols = 20 stalls)
-- ─────────────────────────────────────────────────────────────────────────────

-- Row A
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('A1', 'SMALL',  false, 0, 0) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('A2', 'SMALL',  false, 1, 0) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('A3', 'MEDIUM', false, 2, 0) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('A4', 'MEDIUM', false, 3, 0) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('A5', 'LARGE',  false, 4, 0) ON CONFLICT (name) DO NOTHING;

-- Row B
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('B1', 'SMALL',  false, 0, 1) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('B2', 'SMALL',  false, 1, 1) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('B3', 'MEDIUM', false, 2, 1) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('B4', 'MEDIUM', false, 3, 1) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('B5', 'LARGE',  false, 4, 1) ON CONFLICT (name) DO NOTHING;

-- Row C
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('C1', 'SMALL',  false, 0, 2) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('C2', 'SMALL',  false, 1, 2) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('C3', 'MEDIUM', false, 2, 2) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('C4', 'MEDIUM', false, 3, 2) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('C5', 'LARGE',  false, 4, 2) ON CONFLICT (name) DO NOTHING;

-- Row D
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('D1', 'SMALL',  false, 0, 3) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('D2', 'SMALL',  false, 1, 3) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('D3', 'MEDIUM', false, 2, 3) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('D4', 'MEDIUM', false, 3, 3) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, reserved, positionx, positiony) VALUES ('D5', 'LARGE',  false, 4, 3) ON CONFLICT (name) DO NOTHING;
