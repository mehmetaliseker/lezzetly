package com.lezzetly.backend.service;

import com.lezzetly.backend.dto.CreateReservationRequest;
import com.lezzetly.backend.dto.ReservationResponse;

public interface ReservationService {

	ReservationResponse create(CreateReservationRequest request);
}
