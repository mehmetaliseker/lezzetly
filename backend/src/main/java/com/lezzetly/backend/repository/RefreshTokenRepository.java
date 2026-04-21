package com.lezzetly.backend.repository;

import java.time.OffsetDateTime;
import java.util.Optional;

import com.lezzetly.backend.domain.RefreshToken;

public interface RefreshTokenRepository {

	RefreshToken save(Long userId, String tokenHash, OffsetDateTime expiresAt);

	Optional<RefreshToken> findActiveByHash(String tokenHash, OffsetDateTime now);

	void revokeByHash(String tokenHash, OffsetDateTime revokedAt);
}
