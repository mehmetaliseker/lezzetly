package com.lezzetly.backend.repository;

import com.lezzetly.backend.domain.Reservation;

public interface ReservationRepository {

	Reservation save(Reservation reservation);

	void saveSlots(Long reservationId, Long restaurantId, java.time.LocalDate date, Integer tableNo, java.util.List<Integer> selectedHours);
}
