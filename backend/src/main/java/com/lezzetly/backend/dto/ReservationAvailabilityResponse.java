package com.lezzetly.backend.dto;

import java.time.LocalDate;
import java.util.List;

public record ReservationAvailabilityResponse(
		Long restaurantId,
		LocalDate date,
		List<TableAvailabilityResponse> tables
) {
}
