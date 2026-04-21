package com.lezzetly.backend.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record Reservation(
		Long id,
		Long userId,
		Long restaurantId,
		Integer tableNo,
		LocalDate date,
		List<Integer> selectedHours,
		long slotCount,
		BigDecimal totalPrice,
		ReservationStatus status
) {
}
