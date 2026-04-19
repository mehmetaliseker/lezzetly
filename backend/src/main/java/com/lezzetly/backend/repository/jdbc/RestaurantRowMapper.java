package com.lezzetly.backend.repository.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.lang.NonNull;

import com.lezzetly.backend.domain.Restaurant;

public final class RestaurantRowMapper implements RowMapper<Restaurant> {

	@Override
	public @NonNull Restaurant mapRow(ResultSet rs, int rowNum) throws SQLException {
		return new Restaurant(
				rs.getLong("id"),
				rs.getString("name"),
				rs.getString("city"),
				rs.getBigDecimal("price_per_hour"),
				rs.getBoolean("active")
		);
	}
}
