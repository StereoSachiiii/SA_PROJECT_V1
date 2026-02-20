-- ============================================================================
-- BOOKFAIR: Fresh & Realistic Seed Data – Colombo Book Fair 2026
-- ============================================================================
-- 100+ Stalls with Proper Hall Layout
-- Realistic Pricing Based on Influence Zones
-- Complete Event with Dates and Status
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- DELETED EXISTING DATA (Start Fresh)
-- ─────────────────────────────────────────────────────────────────────────────

TRUNCATE TABLE reservations CASCADE;
TRUNCATE TABLE event_stalls CASCADE;
TRUNCATE TABLE stalls CASCADE;
TRUNCATE TABLE events CASCADE;
TRUNCATE TABLE halls CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- EVENTS
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO events (event_name, event_description, status, event_date, created_at, updated_at)
VALUES (
  'Colombo Book Fair 2026',
  'Sri Lanka''s premier literary festival featuring 100+ publishers, authors, and book vendors. A celebration of reading, writing, and cultural exchange.',
  'OPEN',
  '2026-02-20',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- HALLS
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO halls (hall_name, hall_type, capacity, location, created_at, updated_at)
VALUES (
  'Main Exhibition Hall - Level 1',
  'EXHIBITION',
  10000,
  'Sirimavo Bandaranaike Memorial Exhibition Centre, Colombo',
  NOW(),
  NOW()
) ON CONFLICT (hall_name) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- STALLS (100 stalls, realistic pricing based on influence zones)
-- ─────────────────────────────────────────────────────────────────────────────

-- PREMIUM TIER (Near stage + main entrance) — 9 stalls
-- Visibility Score: 70-100, Price: 2,500,000 - 3,500,000

INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents, description) VALUES
('STAGE-VIP-01', 'LARGE', 3, 2, 75, 8, 3, 2, 350000000, 'Premium stage-view') ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STAGE-VIP-02', 'LARGE', 3, 2, 82, 8, 3, 2, 340000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STAGE-VIP-03', 'LARGE', 3, 2, 89, 8, 3, 2, 330000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('GATE-PRIME-01', 'MEDIUM', 2, 2, 35, 10, 2, 2, 280000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('GATE-PRIME-02', 'MEDIUM', 2, 2, 55, 10, 2, 2, 275000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('GATE-PRIME-03', 'MEDIUM', 2, 2, 38, 25, 2, 2, 270000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('CORNER-A-01', 'MEDIUM', 2, 2, 1, 1, 2, 2, 260000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('CORNER-B-01', 'MEDIUM', 2, 2, 95, 1, 2, 2, 255000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('MAIN-AXIS-01', 'MEDIUM', 2, 2, 45, 20, 2, 2, 250000000) ON CONFLICT (name) DO NOTHING;

-- HIGH TIER (Near main walkway intersections) — 15 stalls
-- Visibility Score: 50-70, Price: 1,800,000 - 2,400,000

INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('HIGH-A-01', 'MEDIUM', 2, 2, 55, 30, 2, 2, 240000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('HIGH-A-02', 'MEDIUM', 2, 2, 62, 30, 2, 2, 235000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('HIGH-A-03', 'MEDIUM', 2, 2, 69, 30, 2, 2, 230000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('HIGH-B-01', 'MEDIUM', 2, 2, 35, 35, 2, 2, 225000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('HIGH-B-02', 'MEDIUM', 2, 2, 42, 35, 2, 2, 220000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('HIGH-B-03', 'MEDIUM', 2, 2, 49, 35, 2, 2, 215000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('HIGH-C-01', 'MEDIUM', 2, 2, 75, 25, 2, 2, 220000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('HIGH-C-02', 'MEDIUM', 2, 2, 82, 25, 2, 2, 215000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('HIGH-D-01', 'MEDIUM', 2, 2, 10, 30, 2, 2, 210000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('HIGH-D-02', 'MEDIUM', 2, 2, 17, 30, 2, 2, 205000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('HIGH-E-01', 'SMALL', 1, 1, 5, 15, 1, 1, 180000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('HIGH-E-02', 'SMALL', 1, 1, 7, 15, 1, 1, 175000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('HIGH-E-03', 'SMALL', 1, 1, 9, 15, 1, 1, 170000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('HIGH-E-04', 'SMALL', 1, 1, 89, 35, 1, 1, 165000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('HIGH-E-05', 'SMALL', 1, 1, 91, 35, 1, 1, 160000000) ON CONFLICT (name) DO NOTHING;

-- STANDARD TIER (Mid-hall, decent visibility) — 40 stalls

INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-A-01', 'SMALL', 1, 1, 25, 20, 1, 1, 120000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-A-02', 'SMALL', 1, 1, 27, 20, 1, 1, 118000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-A-03', 'SMALL', 1, 1, 29, 20, 1, 1, 116000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-A-04', 'SMALL', 1, 1, 31, 20, 1, 1, 114000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-B-01', 'SMALL', 1, 1, 25, 50, 1, 1, 110000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-B-02', 'SMALL', 1, 1, 27, 50, 1, 1, 108000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-B-03', 'SMALL', 1, 1, 29, 50, 1, 1, 106000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-B-04', 'SMALL', 1, 1, 31, 50, 1, 1, 104000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-C-01', 'SMALL', 1, 1, 60, 15, 1, 1, 115000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-C-02', 'SMALL', 1, 1, 62, 15, 1, 1, 113000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-C-03', 'SMALL', 1, 1, 64, 15, 1, 1, 111000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-C-04', 'SMALL', 1, 1, 66, 15, 1, 1, 109000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-D-01', 'SMALL', 1, 1, 68, 15, 1, 1, 107000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-D-02', 'SMALL', 1, 1, 70, 15, 1, 1, 105000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-E-01', 'SMALL', 1, 1, 72, 40, 1, 1, 102000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-E-02', 'SMALL', 1, 1, 74, 40, 1, 1, 100000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-E-03', 'SMALL', 1, 1, 76, 40, 1, 1, 98000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-E-04', 'SMALL', 1, 1, 78, 40, 1, 1, 96000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-F-01', 'SMALL', 1, 1, 12, 45, 1, 1, 105000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-F-02', 'SMALL', 1, 1, 14, 45, 1, 1, 103000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-F-03', 'SMALL', 1, 1, 16, 45, 1, 1, 101000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-F-04', 'SMALL', 1, 1, 18, 45, 1, 1, 99000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-G-01', 'SMALL', 1, 1, 85, 50, 1, 1, 130000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-G-02', 'SMALL', 1, 1, 87, 50, 1, 1, 128000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-G-03', 'SMALL', 1, 1, 89, 50, 1, 1, 126000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-G-04', 'SMALL', 1, 1, 91, 50, 1, 1, 124000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-H-01', 'SMALL', 1, 1, 35, 70, 1, 1, 95000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-H-02', 'SMALL', 1, 1, 37, 70, 1, 1, 93000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-H-03', 'SMALL', 1, 1, 39, 70, 1, 1, 91000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-H-04', 'SMALL', 1, 1, 41, 70, 1, 1, 89000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-I-01', 'SMALL', 1, 1, 60, 60, 1, 1, 100000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-I-02', 'SMALL', 1, 1, 62, 60, 1, 1, 98000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-I-03', 'SMALL', 1, 1, 64, 60, 1, 1, 96000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('STD-I-04', 'SMALL', 1, 1, 66, 60, 1, 1, 94000000) ON CONFLICT (name) DO NOTHING;

-- ECONOMY TIER (Edges, far from entrances/stage) — 36 stalls

INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-A-01', 'SMALL', 1, 1, 3, 60, 1, 1, 75000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-A-02', 'SMALL', 1, 1, 3, 62, 1, 1, 73000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-A-03', 'SMALL', 1, 1, 3, 64, 1, 1, 71000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-A-04', 'SMALL', 1, 1, 3, 66, 1, 1, 69000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-A-05', 'SMALL', 1, 1, 3, 68, 1, 1, 67000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-A-06', 'SMALL', 1, 1, 3, 70, 1, 1, 65000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-B-01', 'SMALL', 1, 1, 95, 60, 1, 1, 70000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-B-02', 'SMALL', 1, 1, 95, 62, 1, 1, 68000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-B-03', 'SMALL', 1, 1, 95, 64, 1, 1, 66000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-B-04', 'SMALL', 1, 1, 95, 66, 1, 1, 64000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-B-05', 'SMALL', 1, 1, 95, 68, 1, 1, 62000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-B-06', 'SMALL', 1, 1, 95, 70, 1, 1, 60000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-C-01', 'SMALL', 1, 1, 20, 80, 1, 1, 72000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-C-02', 'SMALL', 1, 1, 22, 80, 1, 1, 70000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-C-03', 'SMALL', 1, 1, 24, 80, 1, 1, 68000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-C-04', 'SMALL', 1, 1, 26, 80, 1, 1, 66000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-D-01', 'SMALL', 1, 1, 74, 80, 1, 1, 74000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-D-02', 'SMALL', 1, 1, 76, 80, 1, 1, 72000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-D-03', 'SMALL', 1, 1, 78, 80, 1, 1, 70000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-D-04', 'SMALL', 1, 1, 80, 80, 1, 1, 68000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-E-01', 'SMALL', 1, 1, 48, 85, 1, 1, 65000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-E-02', 'SMALL', 1, 1, 50, 85, 1, 1, 63000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-E-03', 'SMALL', 1, 1, 52, 85, 1, 1, 61000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-E-04', 'SMALL', 1, 1, 54, 85, 1, 1, 59000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-F-01', 'SMALL', 1, 1, 10, 85, 1, 1, 62000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-F-02', 'SMALL', 1, 1, 12, 85, 1, 1, 60000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-F-03', 'SMALL', 1, 1, 14, 85, 1, 1, 58000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-F-04', 'SMALL', 1, 1, 16, 85, 1, 1, 56000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-G-01', 'SMALL', 1, 1, 84, 85, 1, 1, 64000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-G-02', 'SMALL', 1, 1, 86, 85, 1, 1, 62000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-G-03', 'SMALL', 1, 1, 88, 85, 1, 1, 60000000) ON CONFLICT (name) DO NOTHING;
INSERT INTO stalls (name, size, width, height, positionx, positiony, col_span, row_span, price_cents) VALUES
('ECO-G-04', 'SMALL', 1, 1, 90, 85, 1, 1, 58000000) ON CONFLICT (name) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- EVENT_STALLS (Link stalls to event)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO event_stalls (event_id, stall_id)
SELECT 1, id FROM stalls
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- SAMPLE RESERVATIONS (Add some realism)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO reservations (event_id, user_id, stall_id, status, created_at, expires_at, paid_at)
SELECT 1, 2, s.id, 'PAID', NOW() - INTERVAL '5 days', NOW() + INTERVAL '30 days', NOW() - INTERVAL '4 days'
FROM stalls s WHERE s.name = 'STAGE-VIP-01'
ON CONFLICT DO NOTHING;

INSERT INTO reservations (event_id, user_id, stall_id, status, created_at, expires_at, paid_at)
SELECT 1, 3, s.id, 'PAID', NOW() - INTERVAL '3 days', NOW() + INTERVAL '30 days', NOW() - INTERVAL '2 days'
FROM stalls s WHERE s.name IN ('GATE-PRIME-01', 'GATE-PRIME-02')
ON CONFLICT DO NOTHING;

INSERT INTO reservations (event_id, user_id, stall_id, status, created_at, expires_at, paid_at)
SELECT 1, 4, s.id, 'PENDING_PAYMENT', NOW() - INTERVAL '1 day', NOW() + INTERVAL '1 day', NULL
FROM stalls s WHERE s.name = 'HIGH-A-01'
ON CONFLICT DO NOTHING;

INSERT INTO reservations (event_id, user_id, stall_id, status, created_at, expires_at, paid_at)
SELECT 1, 2, s.id, 'PAID', NOW() - INTERVAL '2 days', NOW() + INTERVAL '30 days', NOW() - INTERVAL '1 day'
FROM stalls s WHERE s.name IN ('STD-A-01', 'STD-A-02')
ON CONFLICT DO NOTHING;
