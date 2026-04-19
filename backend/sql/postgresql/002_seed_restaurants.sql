-- Örnek seed (isteğe bağlı; id'ler sabit tutuldu.)
-- Tablo zaten doluysa önce TRUNCATE veya koşullu INSERT kullanın.

INSERT INTO restaurants (id, name, city, price_per_hour, active)
VALUES
	(1, 'Deniz Feneri', 'İzmir', 450.00, TRUE),
	(2, 'Tarihi Konak', 'Ankara', 380.50, TRUE)
ON CONFLICT (id) DO NOTHING;

SELECT setval(
	pg_get_serial_sequence('restaurants', 'id'),
	(SELECT COALESCE(MAX(id), 1) FROM restaurants)
);
