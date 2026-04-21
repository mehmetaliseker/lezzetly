package com.lezzetly.backend.repository.jdbc;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.lezzetly.backend.repository.RestaurantTableRepository;

@Repository
public class JdbcRestaurantTableRepository implements RestaurantTableRepository {

	private static final String FIND_ACTIVE_TABLES = """
			SELECT table_no
			FROM restaurant_tables
			WHERE restaurant_id = ? AND active = TRUE
			ORDER BY table_no
			""";

	private final JdbcTemplate jdbcTemplate;

	public JdbcRestaurantTableRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	public List<Integer> findActiveTableNumbers(Long restaurantId) {
		return jdbcTemplate.queryForList(FIND_ACTIVE_TABLES, Integer.class, restaurantId);
	}
}
