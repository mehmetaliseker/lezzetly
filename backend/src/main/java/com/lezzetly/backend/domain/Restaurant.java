package com.lezzetly.backend.domain;

import java.math.BigDecimal;
import java.time.LocalTime;

public record Restaurant(
		Long id,
		String name,
		String city,
		BigDecimal pricePerHour,
		boolean active,
		Integer capacity,
		String imageUrl,
		LocalTime openingTime,
		LocalTime closingTime
) {
}
