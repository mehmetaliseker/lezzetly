package com.lezzetly.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.lezzetly.backend.domain.ReservationStatus;

public record ReservationResponse(
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
