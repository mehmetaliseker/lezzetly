package com.lezzetly.backend.repository.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Repository;

import com.lezzetly.backend.domain.ImageBinaryContent;
import com.lezzetly.backend.domain.RestaurantImageKind;
import com.lezzetly.backend.repository.RestaurantBinaryImageRepository;

@Repository
public class JdbcRestaurantBinaryImageRepository implements RestaurantBinaryImageRepository {

	private static final String LOAD_MAIN = """
			SELECT main_image_data, main_image_content_type
			FROM restaurants
			WHERE id = ? AND active = TRUE
			""";

	private static final String LOAD_DETAIL1 = """
			SELECT detail_image_1_data, detail_image_1_content_type
			FROM restaurants
			WHERE id = ? AND active = TRUE
			""";

	private static final String LOAD_DETAIL2 = """
			SELECT detail_image_2_data, detail_image_2_content_type
			FROM restaurants
			WHERE id = ? AND active = TRUE
			""";

	private static final String SAVE_MAIN = """
			UPDATE restaurants
			SET main_image_data = ?, main_image_content_type = ?, updated_at = NOW()
			WHERE id = ?
			""";

	private static final String SAVE_DETAIL1 = """
			UPDATE restaurants
			SET detail_image_1_data = ?, detail_image_1_content_type = ?, updated_at = NOW()
			WHERE id = ?
			""";

	private static final String SAVE_DETAIL2 = """
			UPDATE restaurants
			SET detail_image_2_data = ?, detail_image_2_content_type = ?, updated_at = NOW()
			WHERE id = ?
			""";

	private static final String CLEAR_MAIN = """
			UPDATE restaurants
			SET main_image_data = NULL, main_image_content_type = NULL, updated_at = NOW()
			WHERE id = ?
			""";

	private static final String CLEAR_DETAIL1 = """
			UPDATE restaurants
			SET detail_image_1_data = NULL, detail_image_1_content_type = NULL, updated_at = NOW()
			WHERE id = ?
			""";

	private static final String CLEAR_DETAIL2 = """
			UPDATE restaurants
			SET detail_image_2_data = NULL, detail_image_2_content_type = NULL, updated_at = NOW()
			WHERE id = ?
			""";

	private static final String HAS_MAIN = """
			SELECT COUNT(*) FROM restaurants WHERE id = ? AND active = TRUE AND main_image_data IS NOT NULL
			""";

	private static final String HAS_DETAIL1 = """
			SELECT COUNT(*) FROM restaurants WHERE id = ? AND active = TRUE AND detail_image_1_data IS NOT NULL
			""";

	private static final String HAS_DETAIL2 = """
			SELECT COUNT(*) FROM restaurants WHERE id = ? AND active = TRUE AND detail_image_2_data IS NOT NULL
			""";

	private final JdbcTemplate jdbcTemplate;

	public JdbcRestaurantBinaryImageRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	public Optional<ImageBinaryContent> load(Long restaurantId, RestaurantImageKind kind) {
		return switch (kind) {
			case MAIN -> loadPair(restaurantId, LOAD_MAIN, "main_image_data", "main_image_content_type");
			case DETAIL1 -> loadPair(restaurantId, LOAD_DETAIL1, "detail_image_1_data", "detail_image_1_content_type");
			case DETAIL2 -> loadPair(restaurantId, LOAD_DETAIL2, "detail_image_2_data", "detail_image_2_content_type");
		};
	}

	private Optional<ImageBinaryContent> loadPair(Long restaurantId, String sql, String dataColumn, String typeColumn) {
		return jdbcTemplate.query(
				sql,
				(ResultSetExtractor<Optional<ImageBinaryContent>>) (ResultSet rs) -> mapImageRow(rs, dataColumn, typeColumn),
				restaurantId
		);
	}

	private static Optional<ImageBinaryContent> mapImageRow(ResultSet rs, String dataColumn, String typeColumn) throws SQLException {
		if (!rs.next()) {
			return Optional.empty();
		}
		byte[] data = rs.getBytes(dataColumn);
		String contentType = rs.getString(typeColumn);
		if (data == null || data.length == 0) {
			return Optional.empty();
		}
		return Optional.of(new ImageBinaryContent(data, contentType != null ? contentType : "application/octet-stream"));
	}

	@Override
	public void saveMain(Long restaurantId, byte[] data, String contentType) {
		jdbcTemplate.update(SAVE_MAIN, data, contentType, restaurantId);
	}

	@Override
	public void saveDetail1(Long restaurantId, byte[] data, String contentType) {
		jdbcTemplate.update(SAVE_DETAIL1, data, contentType, restaurantId);
	}

	@Override
	public void saveDetail2(Long restaurantId, byte[] data, String contentType) {
		jdbcTemplate.update(SAVE_DETAIL2, data, contentType, restaurantId);
	}

	@Override
	public void clearMain(Long restaurantId) {
		jdbcTemplate.update(CLEAR_MAIN, restaurantId);
	}

	@Override
	public void clearDetail1(Long restaurantId) {
		jdbcTemplate.update(CLEAR_DETAIL1, restaurantId);
	}

	@Override
	public void clearDetail2(Long restaurantId) {
		jdbcTemplate.update(CLEAR_DETAIL2, restaurantId);
	}

	@Override
	public boolean hasMainBlob(Long restaurantId) {
		Integer count = jdbcTemplate.queryForObject(HAS_MAIN, Integer.class, restaurantId);
		return count != null && count > 0;
	}

	@Override
	public boolean hasDetail1Blob(Long restaurantId) {
		Integer count = jdbcTemplate.queryForObject(HAS_DETAIL1, Integer.class, restaurantId);
		return count != null && count > 0;
	}

	@Override
	public boolean hasDetail2Blob(Long restaurantId) {
		Integer count = jdbcTemplate.queryForObject(HAS_DETAIL2, Integer.class, restaurantId);
		return count != null && count > 0;
	}
}
