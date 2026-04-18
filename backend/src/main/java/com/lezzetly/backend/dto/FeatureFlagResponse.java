package com.lezzetly.backend.dto;

public record FeatureFlagResponse(
		String key,
		boolean enabled,
		String description
) {
}
