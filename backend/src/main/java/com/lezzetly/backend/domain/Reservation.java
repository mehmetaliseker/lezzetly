package com.lezzetly.backend.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record Reservation(
		Long id,
		Long restaurantId,
		LocalDate date,
		LocalTime startTime,
		LocalTime endTime,
		long durationMinutes,
		BigDecimal totalPrice,
		ReservationStatus status
) {
}
