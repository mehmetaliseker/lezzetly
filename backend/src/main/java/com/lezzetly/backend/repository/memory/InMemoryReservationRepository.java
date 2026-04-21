package com.lezzetly.backend.repository.memory;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.List;
import java.time.LocalDate;

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
				reservation.userId(),
				reservation.restaurantId(),
				reservation.tableNo(),
				reservation.date(),
				reservation.selectedHours(),
				reservation.slotCount(),
				reservation.totalPrice(),
				reservation.status()
		);
		storage.put(id, persisted);
		return persisted;
	}

	@Override
	public void saveSlots(Long reservationId, Long restaurantId, LocalDate date, Integer tableNo, List<Integer> selectedHours) {
	}
}
