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
