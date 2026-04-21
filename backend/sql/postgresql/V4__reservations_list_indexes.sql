-- Rezervasyon listeleri (müşteri paneli, restoran bazlı son kayıtlar) için arama yolu
CREATE INDEX IF NOT EXISTS idx_reservations_user_restaurant_date_id
	ON reservations (user_id, restaurant_id, reservation_date DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_reservations_user_date_id
	ON reservations (user_id, reservation_date DESC, id DESC);
