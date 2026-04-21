package com.lezzetly.backend.dto;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public record RestaurantResponse(
		Long id,
		String name,
		String city,
		BigDecimal pricePerHour,
		boolean active,
		Integer tableCount,
		String openingTime,
		String closingTime,
		String mainImageUrl,
		List<String> detailImageUrls
) {
	private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

	public static String formatTimeOrNull(LocalTime time) {
		return time != null ? time.format(TIME_FORMAT) : null;
	}
}
