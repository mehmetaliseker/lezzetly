package com.lezzetly.backend.repository.jdbc;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.lezzetly.backend.repository.RestaurantTableRepository;

@Repository
public class JdbcRestaurantTableRepository implements RestaurantTableRepository {

	private static final String FIND_ACTIVE_TABLES = """
			SELECT table_no
			FROM restaurant_tables
			WHERE restaurant_id = ? AND active = TRUE
			ORDER BY table_no
			""";

	private static final String DELETE_BY_RESTAURANT = """
			DELETE FROM restaurant_tables
			WHERE restaurant_id = ?
			""";

	private static final String INSERT_TABLE = """
			INSERT INTO restaurant_tables (restaurant_id, table_no, active)
			VALUES (?, ?, TRUE)
			""";

	private final JdbcTemplate jdbcTemplate;

	public JdbcRestaurantTableRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	public List<Integer> findActiveTableNumbers(Long restaurantId) {
		return jdbcTemplate.queryForList(FIND_ACTIVE_TABLES, Integer.class, restaurantId);
	}

	@Override
	@Transactional
	public void replaceTables(Long restaurantId, Integer capacity) {
		int totalTables = capacity == null ? 0 : Math.max(capacity, 0);
		jdbcTemplate.update(DELETE_BY_RESTAURANT, restaurantId);
		for (int tableNo = 1; tableNo <= totalTables; tableNo++) {
			jdbcTemplate.update(INSERT_TABLE, restaurantId, tableNo);
		}
	}
}
