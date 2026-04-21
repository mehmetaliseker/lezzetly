package com.lezzetly.backend.repository.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;

import org.springframework.jdbc.core.RowMapper;

import com.lezzetly.backend.domain.RefreshToken;

public final class RefreshTokenRowMapper implements RowMapper<RefreshToken> {

	@Override
	public RefreshToken mapRow(ResultSet rs, int rowNum) throws SQLException {
		return new RefreshToken(
				rs.getLong("id"),
				rs.getLong("user_id"),
				rs.getString("token_hash"),
				rs.getObject("expires_at", OffsetDateTime.class),
				rs.getBoolean("revoked"),
				rs.getObject("created_at", OffsetDateTime.class),
				rs.getObject("revoked_at", OffsetDateTime.class)
		);
	}
}
