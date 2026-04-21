package com.lezzetly.backend.security;

public record JwtTokens(
		String accessToken,
		String refreshToken,
		long accessTokenExpiresInSeconds,
		long refreshTokenExpiresInSeconds
) {
}
