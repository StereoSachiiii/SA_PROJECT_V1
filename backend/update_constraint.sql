ALTER TABLE reservations DROP CONSTRAINT IF EXISTS reservations_status_check;
ALTER TABLE reservations ADD CONSTRAINT reservations_status_check CHECK (status::text = ANY (ARRAY['PENDING_PAYMENT'::character varying, 'PAID'::character varying, 'CANCELLED'::character varying, 'EXPIRED'::character varying, 'CHECKED_IN'::character varying, 'PENDING_REFUND'::character varying]::text[]));
