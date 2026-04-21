CREATE TABLE IF NOT EXISTS refresh_tokens (
	id BIGSERIAL PRIMARY KEY,
	user_id BIGINT NOT NULL,
	token_hash VARCHAR(64) NOT NULL UNIQUE,
	expires_at TIMESTAMPTZ NOT NULL,
	revoked BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	revoked_at TIMESTAMPTZ,
	CONSTRAINT refresh_tokens_user_id_fkey
		FOREIGN KEY (user_id) REFERENCES users (id)
		ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens (expires_at);

CREATE TABLE IF NOT EXISTS restaurant_images (
	id BIGSERIAL PRIMARY KEY,
	restaurant_id BIGINT NOT NULL,
	image_url VARCHAR(1024) NOT NULL,
	is_primary BOOLEAN NOT NULL DEFAULT FALSE,
	display_order SMALLINT NOT NULL DEFAULT 0,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT restaurant_images_restaurant_id_fkey
		FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
		ON DELETE CASCADE,
	CONSTRAINT restaurant_images_url_nonempty CHECK (char_length(trim(image_url)) > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_restaurant_primary_image
	ON restaurant_images (restaurant_id)
	WHERE is_primary = TRUE;

CREATE TABLE IF NOT EXISTS restaurant_tables (
	id BIGSERIAL PRIMARY KEY,
	restaurant_id BIGINT NOT NULL,
	table_no INTEGER NOT NULL,
	active BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT restaurant_tables_restaurant_id_fkey
		FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
		ON DELETE CASCADE,
	CONSTRAINT restaurant_tables_table_no_positive CHECK (table_no > 0),
	CONSTRAINT restaurant_tables_unique UNIQUE (restaurant_id, table_no)
);

INSERT INTO restaurant_tables (restaurant_id, table_no, active)
SELECT r.id, gs.value, TRUE
FROM restaurants r
CROSS JOIN LATERAL (
	SELECT generate_series(1, COALESCE(NULLIF(r.capacity, 0), 8)) AS value
) gs
ON CONFLICT (restaurant_id, table_no) DO NOTHING;

CREATE TABLE IF NOT EXISTS reservations (
	id BIGSERIAL PRIMARY KEY,
	user_id BIGINT NOT NULL,
	restaurant_id BIGINT NOT NULL,
	table_no INTEGER NOT NULL,
	reservation_date DATE NOT NULL,
	slot_count INTEGER NOT NULL,
	total_price NUMERIC(10, 2) NOT NULL,
	status VARCHAR(32) NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT reservations_user_id_fkey
		FOREIGN KEY (user_id) REFERENCES users (id)
		ON DELETE RESTRICT,
	CONSTRAINT reservations_restaurant_id_fkey
		FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
		ON DELETE RESTRICT,
	CONSTRAINT reservations_status_allowed CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
	CONSTRAINT reservations_slot_count_positive CHECK (slot_count > 0),
	CONSTRAINT reservations_total_price_non_negative CHECK (total_price >= 0)
);

CREATE TABLE IF NOT EXISTS reservation_slots (
	id BIGSERIAL PRIMARY KEY,
	reservation_id BIGINT NOT NULL,
	restaurant_id BIGINT NOT NULL,
	reservation_date DATE NOT NULL,
	table_no INTEGER NOT NULL,
	slot_hour INTEGER NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT reservation_slots_reservation_id_fkey
		FOREIGN KEY (reservation_id) REFERENCES reservations (id)
		ON DELETE CASCADE,
	CONSTRAINT reservation_slots_slot_hour_range CHECK (slot_hour BETWEEN 0 AND 23),
	CONSTRAINT reservation_slots_unique UNIQUE (restaurant_id, reservation_date, table_no, slot_hour)
);

CREATE INDEX IF NOT EXISTS idx_reservation_slots_lookup
	ON reservation_slots (restaurant_id, reservation_date, table_no);
