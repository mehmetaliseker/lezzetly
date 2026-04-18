package com.lezzetly.backend.dto;

import java.math.BigDecimal;

public record RestaurantResponse(
		Long id,
		String name,
		String city,
		BigDecimal pricePerHour,
		boolean active
) {
}
