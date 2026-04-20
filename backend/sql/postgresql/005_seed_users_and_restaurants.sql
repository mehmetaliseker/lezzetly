INSERT INTO users (id, first_name, last_name, email, password_hash, role, active)
VALUES
	(1, 'Ayşe', 'Yönetici', 'admin@lezzetly.local', '$2a$12$OvFNFIXPLACEHOLDERNOTAVALIDBCRYPTHASHVALUE00000000000000000000000', 'ADMIN', TRUE),
	(2, 'Mehmet', 'Sahil', 'owner@lezzetly.local', '$2a$12$OvFNFIXPLACEHOLDERNOTAVALIDBCRYPTHASHVALUE00000000000000000000000', 'OWNER', TRUE),
	(3, 'Zeynep', 'Misafir', 'customer@lezzetly.local', '$2a$12$OvFNFIXPLACEHOLDERNOTAVALIDBCRYPTHASHVALUE00000000000000000000000', 'CUSTOMER', TRUE)
ON CONFLICT (email) DO NOTHING;

SELECT setval(
	pg_get_serial_sequence('users', 'id'),
	(SELECT COALESCE(MAX(id), 1) FROM users)
);

UPDATE restaurants
SET
	owner_user_id = 2,
	description = 'Ege mutfağı ve deniz ürünleri; aile işletmesi.',
	address = 'Alsancak, İzmir',
	phone = '+90 232 000 00 01',
	capacity = 45,
	opening_time = TIME '11:00',
	closing_time = TIME '23:30',
	image_url = NULL
WHERE id = 1;

UPDATE restaurants
SET
	owner_user_id = 2,
	description = 'Ankara''da geleneksel lezzetler; etkinlik ve grup yemekleri.',
	address = 'Çankaya, Ankara',
	phone = '+90 312 000 00 02',
	capacity = 60,
	opening_time = TIME '10:00',
	closing_time = TIME '22:00',
	image_url = NULL
WHERE id = 2;

-- Tüm kayıtlarda sahip atandıysa iş kuralını sıkılaştır (yeni kurulumda tablo boşsa atlanır).
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM restaurants WHERE owner_user_id IS NULL) THEN
		IF EXISTS (SELECT 1 FROM restaurants) THEN
			ALTER TABLE restaurants ALTER COLUMN owner_user_id SET NOT NULL;
		END IF;
	END IF;
END $$;
