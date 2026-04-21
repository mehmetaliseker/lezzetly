package com.lezzetly.backend.repository;

import java.util.List;

import com.lezzetly.backend.domain.Reservation;

public interface ReservationRepository {

	Reservation save(Reservation reservation);

	void saveSlots(Long reservationId, Long restaurantId, java.time.LocalDate date, Integer tableNo, java.util.List<Integer> selectedHours);

	List<Reservation> findPastByUserAndRestaurantLimited(Long userId, Long restaurantId, int limit);
}
