package com.lezzetly.backend.repository.memory;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import com.lezzetly.backend.domain.Reservation;
import com.lezzetly.backend.repository.ReservationRepository;

public final class InMemoryReservationRepository implements ReservationRepository {

	private final ConcurrentHashMap<Long, Reservation> storage = new ConcurrentHashMap<>();
	private final AtomicLong sequence = new AtomicLong(1);

	@Override
	public Reservation save(Reservation reservation) {
		long id = sequence.getAndIncrement();
		Reservation persisted = new Reservation(
				id,
				reservation.restaurantId(),
				reservation.date(),
				reservation.startTime(),
				reservation.endTime(),
				reservation.durationMinutes(),
				reservation.totalPrice(),
				reservation.status()
		);
		storage.put(id, persisted);
		return persisted;
	}
}
