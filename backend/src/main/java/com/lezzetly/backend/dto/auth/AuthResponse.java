package com.lezzetly.backend.dto.auth;

public record AuthResponse(
		String message,
		AuthUserResponse user,
		TokenPairResponse tokens
) {
}
