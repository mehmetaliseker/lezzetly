package com.lezzetly.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record RestaurantResponse(
		Long id,
		String name,
		String city,
		BigDecimal pricePerHour,
		boolean active,
		Integer tableCount,
		String mainImageUrl,
		List<String> detailImageUrls
) {
}
