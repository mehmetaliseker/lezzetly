package com.lezzetly.backend.repository.jdbc;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.lezzetly.backend.repository.RestaurantImageRepository;

@Repository
public class JdbcRestaurantImageRepository implements RestaurantImageRepository {

	private static final String FIND_DETAIL_IMAGES = """
			SELECT image_url
			FROM restaurant_images
			WHERE restaurant_id = ? AND is_primary = FALSE
			ORDER BY display_order
			LIMIT 2
			""";

	private final JdbcTemplate jdbcTemplate;

	public JdbcRestaurantImageRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	public List<String> findDetailImageUrls(Long restaurantId) {
		return jdbcTemplate.queryForList(FIND_DETAIL_IMAGES, String.class, restaurantId);
	}
}
