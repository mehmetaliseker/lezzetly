package com.lezzetly.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import com.lezzetly.backend.domain.ReservationStatus;

public record ReservationResponse(
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
