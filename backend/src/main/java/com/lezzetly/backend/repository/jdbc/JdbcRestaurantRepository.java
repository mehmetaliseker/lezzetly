package com.lezzetly.backend.repository.jdbc;

import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.lezzetly.backend.domain.Restaurant;
import com.lezzetly.backend.repository.RestaurantRepository;

@Repository
public class JdbcRestaurantRepository implements RestaurantRepository {

	private static final String SELECT_COLUMNS = """
			SELECT id, name, city, price_per_hour, active, capacity, image_url, opening_time, closing_time
			FROM restaurants
			""";

	private static final String FIND_ALL_ACTIVE = SELECT_COLUMNS + """
			WHERE active = TRUE
			ORDER BY id
			""";

	private static final String FIND_BY_ID = SELECT_COLUMNS + """
			WHERE id = ?
			""";

	private final JdbcTemplate jdbcTemplate;
	private final RestaurantRowMapper rowMapper;

	public JdbcRestaurantRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
		this.rowMapper = new RestaurantRowMapper();
	}

	@Override
	public List<Restaurant> findAllActive() {
		return jdbcTemplate.query(FIND_ALL_ACTIVE, rowMapper);
	}

	@Override
	public Optional<Restaurant> findById(Long id) {
		List<Restaurant> rows = jdbcTemplate.query(FIND_BY_ID, rowMapper, id);
		return rows.stream().findFirst();
	}
}
