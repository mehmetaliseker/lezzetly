package com.lezzetly.backend.dto.auth;

public record AuthUserResponse(
		Long id,
		String firstName,
		String lastName,
		String email,
		String phone,
		String role
) {
}
