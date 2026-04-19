-- PostgreSQL: restoranlar tablosu (manuel çalıştırın; Flyway/Liquibase kullanılmaz.)
-- Şema adı kullanmıyorsanız varsayılan public şemasına oluşur.

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
