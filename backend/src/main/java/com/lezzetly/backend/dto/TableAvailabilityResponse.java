package com.lezzetly.backend.dto;

import java.util.List;

public record TableAvailabilityResponse(
		Integer tableNo,
		List<Integer> disabledHours
) {
}
