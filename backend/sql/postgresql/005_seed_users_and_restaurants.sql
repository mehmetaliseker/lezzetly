-- Örnek restoran alanları (kullanıcı seed yok; owner_user_id uygulama üzerinden atanır)
UPDATE restaurants
SET
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
