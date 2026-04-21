package com.lezzetly.backend.dto.auth;

public record TokenPairResponse(
		String accessToken,
		String refreshToken,
		long accessTokenExpiresInSeconds,
		long refreshTokenExpiresInSeconds
) {
}
