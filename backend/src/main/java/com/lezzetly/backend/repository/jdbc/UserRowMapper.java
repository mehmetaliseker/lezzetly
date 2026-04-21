package com.lezzetly.backend.repository.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.lezzetly.backend.domain.User;
import com.lezzetly.backend.domain.UserRole;

public final class UserRowMapper implements RowMapper<User> {

	@Override
	public User mapRow(ResultSet rs, int rowNum) throws SQLException {
		return new User(
				rs.getLong("id"),
				rs.getString("first_name"),
				rs.getString("last_name"),
				rs.getString("email"),
				rs.getString("phone"),
				rs.getString("password_hash"),
				UserRole.valueOf(rs.getString("role")),
				rs.getBoolean("active"),
				rs.getObject("created_at", java.time.OffsetDateTime.class),
				rs.getObject("updated_at", java.time.OffsetDateTime.class)
		);
	}
}
