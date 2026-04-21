package com.lezzetly.backend.repository.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Time;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.lang.NonNull;

import com.lezzetly.backend.domain.Restaurant;

public final class RestaurantRowMapper implements RowMapper<Restaurant> {

	@Override
	public @NonNull Restaurant mapRow(ResultSet rs, int rowNum) throws SQLException {
		Time opening = rs.getTime("opening_time");
		Time closing = rs.getTime("closing_time");
		return new Restaurant(
				rs.getLong("id"),
				rs.getString("name"),
				rs.getString("city"),
				rs.getBigDecimal("price_per_hour"),
				rs.getBoolean("active"),
				(Integer) rs.getObject("capacity"),
				rs.getString("image_url"),
				opening != null ? opening.toLocalTime() : null,
				closing != null ? closing.toLocalTime() : null
		);
	}
}
