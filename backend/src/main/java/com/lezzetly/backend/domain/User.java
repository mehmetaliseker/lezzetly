package com.lezzetly.backend.domain;

import java.time.OffsetDateTime;

public record User(
		Long id,
		String firstName,
		String lastName,
		String email,
		String phone,
		String passwordHash,
		UserRole role,
		boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt
) {
}
