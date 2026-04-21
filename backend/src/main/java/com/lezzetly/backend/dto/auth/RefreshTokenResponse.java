package com.lezzetly.backend.dto.auth;

public record RefreshTokenResponse(
		String message,
		TokenPairResponse tokens
) {
}
