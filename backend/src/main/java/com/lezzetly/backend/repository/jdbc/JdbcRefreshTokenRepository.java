package com.lezzetly.backend.repository.jdbc;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.lezzetly.backend.domain.RefreshToken;
import com.lezzetly.backend.repository.RefreshTokenRepository;

@Repository
public class JdbcRefreshTokenRepository implements RefreshTokenRepository {

	private static final String INSERT = """
			INSERT INTO refresh_tokens (user_id, token_hash, expires_at, revoked)
			VALUES (?, ?, ?, FALSE)
			RETURNING id
			""";

	private static final String FIND_ACTIVE_BY_HASH = """
			SELECT id, user_id, token_hash, expires_at, revoked, created_at, revoked_at
			FROM refresh_tokens
			WHERE token_hash = ?
			  AND revoked = FALSE
			  AND expires_at > ?
			LIMIT 1
			""";

	private static final String REVOKE_BY_HASH = """
			UPDATE refresh_tokens
			SET revoked = TRUE, revoked_at = ?
			WHERE token_hash = ? AND revoked = FALSE
			""";

	private final JdbcTemplate jdbcTemplate;
	private final RefreshTokenRowMapper rowMapper;

	public JdbcRefreshTokenRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
		this.rowMapper = new RefreshTokenRowMapper();
	}

	@Override
	public RefreshToken save(Long userId, String tokenHash, OffsetDateTime expiresAt) {
		Long id = jdbcTemplate.queryForObject(INSERT, Long.class, userId, tokenHash, expiresAt);
		if (id == null) {
			throw new IllegalStateException("Refresh token kimliği üretilemedi");
		}
		return new RefreshToken(id, userId, tokenHash, expiresAt, false, null, null);
	}

	@Override
	public Optional<RefreshToken> findActiveByHash(String tokenHash, OffsetDateTime now) {
		List<RefreshToken> rows = jdbcTemplate.query(FIND_ACTIVE_BY_HASH, rowMapper, tokenHash, now);
		return rows.stream().findFirst();
	}

	@Override
	public void revokeByHash(String tokenHash, OffsetDateTime revokedAt) {
		jdbcTemplate.update(REVOKE_BY_HASH, revokedAt, tokenHash);
	}
}
