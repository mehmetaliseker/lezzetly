package com.lezzetly.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record OwnerRestaurantProfileResponse(
		Long restaurantId,
		String name,
		String city,
		String description,
		String address,
		String phone,
		Integer capacity,
		BigDecimal pricePerHour,
		String openingTime,
		String closingTime,
		String mainImageUrl,
		List<String> detailImageUrls
) {
}
