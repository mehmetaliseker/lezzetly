package com.lezzetly.backend.security;

import com.lezzetly.backend.domain.UserRole;

public record AuthenticatedUser(
		Long userId,
		String email,
		String firstName,
		String lastName,
		UserRole role
) {
}
