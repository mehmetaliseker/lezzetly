package com.lezzetly.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;

public record CreateReservationRequest(
		@NotNull(message = "restaurantId zorunludur")
		Long restaurantId,
		@NotNull(message = "date zorunludur")
		LocalDate date,
		@NotNull(message = "startTime zorunludur")
		LocalTime startTime,
		@NotNull(message = "endTime zorunludur")
		LocalTime endTime
) {
}
