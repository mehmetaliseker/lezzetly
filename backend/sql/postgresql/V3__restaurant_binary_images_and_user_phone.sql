-- Binary görseller (ana + 2 detay) ve kullanıcı telefonu

ALTER TABLE users
	ADD COLUMN IF NOT EXISTS phone VARCHAR(40);

ALTER TABLE restaurants
	ADD COLUMN IF NOT EXISTS main_image_data BYTEA,
	ADD COLUMN IF NOT EXISTS main_image_content_type VARCHAR(128),
	ADD COLUMN IF NOT EXISTS detail_image_1_data BYTEA,
	ADD COLUMN IF NOT EXISTS detail_image_1_content_type VARCHAR(128),
	ADD COLUMN IF NOT EXISTS detail_image_2_data BYTEA,
	ADD COLUMN IF NOT EXISTS detail_image_2_content_type VARCHAR(128);

COMMENT ON COLUMN restaurants.main_image_data IS 'Ana görsel (binary)';
COMMENT ON COLUMN restaurants.detail_image_1_data IS 'Detay görsel 1 (binary)';
COMMENT ON COLUMN restaurants.detail_image_2_data IS 'Detay görsel 2 (binary)';
