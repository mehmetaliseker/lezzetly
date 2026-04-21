-- Flyway sürümlü migration (001 + 003 + 004 ile aynı idempotent içerik)
-- Çalışma dizini: backend modül kökü (spring.flyway.locations=filesystem:sql/postgresql)

CREATE TABLE IF NOT EXISTS restaurants (
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(200) NOT NULL,
	city VARCHAR(120) NOT NULL,
	price_per_hour NUMERIC(10, 2) NOT NULL,
	active BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT restaurants_name_nonempty CHECK (char_length(trim(name)) > 0),
	CONSTRAINT restaurants_city_nonempty CHECK (char_length(trim(city)) > 0),
	CONSTRAINT restaurants_price_non_negative CHECK (price_per_hour >= 0)
);

CREATE INDEX IF NOT EXISTS idx_restaurants_active ON restaurants (active) WHERE active = TRUE;

CREATE TABLE IF NOT EXISTS users (
	id BIGSERIAL PRIMARY KEY,
	first_name VARCHAR(80) NOT NULL,
	last_name VARCHAR(80) NOT NULL,
	email VARCHAR(255) NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	role VARCHAR(32) NOT NULL,
	active BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT users_email_unique UNIQUE (email),
	CONSTRAINT users_email_nonempty CHECK (char_length(trim(email)) > 0),
	CONSTRAINT users_names_nonempty CHECK (
		char_length(trim(first_name)) > 0 AND char_length(trim(last_name)) > 0
	),
	CONSTRAINT users_role_allowed CHECK (role IN ('CUSTOMER', 'OWNER', 'ADMIN')),
	CONSTRAINT users_password_hash_nonempty CHECK (char_length(trim(password_hash)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users (role) WHERE active = TRUE;

CREATE INDEX IF NOT EXISTS idx_users_active ON users (active);

ALTER TABLE restaurants
	ADD COLUMN IF NOT EXISTS owner_user_id BIGINT,
	ADD COLUMN IF NOT EXISTS description TEXT,
	ADD COLUMN IF NOT EXISTS address VARCHAR(500),
	ADD COLUMN IF NOT EXISTS phone VARCHAR(40),
	ADD COLUMN IF NOT EXISTS capacity INTEGER,
	ADD COLUMN IF NOT EXISTS opening_time TIME,
	ADD COLUMN IF NOT EXISTS closing_time TIME,
	ADD COLUMN IF NOT EXISTS image_url VARCHAR(1024);

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'restaurants_capacity_non_negative'
	) THEN
		ALTER TABLE restaurants
			ADD CONSTRAINT restaurants_capacity_non_negative
			CHECK (capacity IS NULL OR capacity >= 0);
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'restaurants_owner_user_id_fkey'
	) THEN
		ALTER TABLE restaurants
			ADD CONSTRAINT restaurants_owner_user_id_fkey
			FOREIGN KEY (owner_user_id) REFERENCES users (id)
			ON DELETE RESTRICT;
	END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_restaurants_owner_user_id ON restaurants (owner_user_id);

COMMENT ON COLUMN restaurants.owner_user_id IS 'Restoranın bağlı olduğu OWNER rolündeki kullanıcı';
