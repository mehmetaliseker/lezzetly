package com.lezzetly.backend.repository.jdbc;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

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

	private static final String DELETE_DETAIL_IMAGES = """
			DELETE FROM restaurant_images
			WHERE restaurant_id = ? AND is_primary = FALSE
			""";

	private static final String INSERT_DETAIL_IMAGE = """
			INSERT INTO restaurant_images (restaurant_id, image_url, is_primary, display_order)
			VALUES (?, ?, FALSE, ?)
			""";

	private final JdbcTemplate jdbcTemplate;

	public JdbcRestaurantImageRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	public List<String> findDetailImageUrls(Long restaurantId) {
		return jdbcTemplate.queryForList(FIND_DETAIL_IMAGES, String.class, restaurantId);
	}

	@Override
	@Transactional
	public void replaceDetailImages(Long restaurantId, List<String> detailImageUrls) {
		jdbcTemplate.update(DELETE_DETAIL_IMAGES, restaurantId);
		if (detailImageUrls == null) {
			return;
		}
		int order = 1;
		for (String imageUrl : detailImageUrls) {
			if (imageUrl == null || imageUrl.trim().isEmpty()) {
				continue;
			}
			jdbcTemplate.update(INSERT_DETAIL_IMAGE, restaurantId, imageUrl.trim(), order);
			order++;
			if (order > 2) {
				break;
			}
		}
	}
}
