package com.lezzetly.backend.domain;

import java.math.BigDecimal;

public record Restaurant(
		Long id,
		String name,
		String city,
		BigDecimal pricePerHour,
		boolean active
) {
}
