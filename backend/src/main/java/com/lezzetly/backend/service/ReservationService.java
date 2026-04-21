package com.lezzetly.backend.service;

import com.lezzetly.backend.dto.CreateReservationRequest;
import com.lezzetly.backend.dto.ReservationAvailabilityResponse;
import com.lezzetly.backend.dto.ReservationResponse;

import java.time.LocalDate;

public interface ReservationService {

	ReservationResponse create(Long userId, CreateReservationRequest request);

	ReservationAvailabilityResponse availability(Long restaurantId, LocalDate date);
}
