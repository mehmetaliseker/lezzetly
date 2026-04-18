package com.lezzetly.backend.dto;

import java.util.List;

public record ErrorResponse(
		String message,
		List<String> details
) {
	public static ErrorResponse of(String message) {
		return new ErrorResponse(message, List.of());
	}
}
