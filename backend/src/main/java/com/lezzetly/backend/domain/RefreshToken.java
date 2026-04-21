package com.lezzetly.backend.domain;

import java.time.OffsetDateTime;

public record RefreshToken(
		Long id,
		Long userId,
		String tokenHash,
		OffsetDateTime expiresAt,
		boolean revoked,
		OffsetDateTime createdAt,
		OffsetDateTime revokedAt
) {
}
