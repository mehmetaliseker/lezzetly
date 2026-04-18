package com.lezzetly.backend.repository;

import com.lezzetly.backend.domain.Reservation;

public interface ReservationRepository {

	Reservation save(Reservation reservation);
}
