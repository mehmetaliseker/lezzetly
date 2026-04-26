package com.lezzetly.backend.service;

import java.time.LocalDate;
import java.util.List;

import com.lezzetly.backend.dto.CreateReservationRequest;
import com.lezzetly.backend.dto.CustomerReservationCardResponse;
import com.lezzetly.backend.dto.ReservationAvailabilityResponse;
import com.lezzetly.backend.dto.ReservationResponse;

public interface ReservationService {

	ReservationResponse create(Long userId, CreateReservationRequest request);

	ReservationAvailabilityResponse availability(Long restaurantId, LocalDate date);

	List<ReservationResponse> listPastForRestaurant(Long userId, Long restaurantId, int limit);

	List<ReservationResponse> listRecentForRestaurant(Long userId, Long restaurantId, int limit);

	List<CustomerReservationCardResponse> listMine(Long userId, int limit);

	void cancelMyUpcomingReservation(Long userId, Long reservationId);
}
