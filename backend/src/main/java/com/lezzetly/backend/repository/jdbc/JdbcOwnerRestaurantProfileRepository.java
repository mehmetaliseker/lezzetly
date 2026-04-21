package com.lezzetly.backend.repository.jdbc;

import java.math.BigDecimal;
import java.sql.Time;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.lezzetly.backend.dto.OwnerRestaurantProfileResponse;
import com.lezzetly.backend.dto.UpdateOwnerRestaurantProfileRequest;
import com.lezzetly.backend.repository.OwnerRestaurantProfileRepository;
import com.lezzetly.backend.repository.RestaurantBinaryImageRepository;
import com.lezzetly.backend.repository.RestaurantImageRepository;
import com.lezzetly.backend.repository.RestaurantTableRepository;

@Repository
public class JdbcOwnerRestaurantProfileRepository implements OwnerRestaurantProfileRepository {

	private static final DateTimeFormatter TIME_FORMAT_HH_MM = DateTimeFormatter.ofPattern("HH:mm");

	private static final DateTimeFormatter TIME_FORMAT_H_MM = DateTimeFormatter.ofPattern("H:mm");

	private static final DateTimeFormatter TIME_FORMAT_HH_MM_SS = DateTimeFormatter.ofPattern("HH:mm:ss");

	private static final DateTimeFormatter TIME_FORMAT_H_MM_SS = DateTimeFormatter.ofPattern("H:mm:ss");

	private static final String FIND_BY_OWNER = """
			SELECT id, name, city, description, address, phone, capacity, price_per_hour, opening_time, closing_time, image_url, active
			FROM restaurants
			WHERE owner_user_id = ?
			LIMIT 1
			""";

	private static final String UPDATE_BY_OWNER = """
			UPDATE restaurants
			SET name = ?, city = ?, description = ?, address = ?, phone = ?, capacity = ?, price_per_hour = ?,
			    opening_time = ?, closing_time = ?, updated_at = NOW()
			WHERE owner_user_id = ?
			""";

	private static final String INSERT_FOR_OWNER = """
			INSERT INTO restaurants (
				name, city, price_per_hour, active, owner_user_id, description, address, phone, capacity,
				opening_time, closing_time
			)
			VALUES (?, ?, ?, TRUE, ?, ?, ?, ?, ?, ?, ?)
			RETURNING id
			""";

	private final JdbcTemplate jdbcTemplate;
	private final RestaurantImageRepository restaurantImageRepository;
	private final RestaurantTableRepository restaurantTableRepository;
	private final RestaurantBinaryImageRepository restaurantBinaryImageRepository;

	public JdbcOwnerRestaurantProfileRepository(
			JdbcTemplate jdbcTemplate,
			RestaurantImageRepository restaurantImageRepository,
			RestaurantTableRepository restaurantTableRepository,
			RestaurantBinaryImageRepository restaurantBinaryImageRepository
	) {
		this.jdbcTemplate = jdbcTemplate;
		this.restaurantImageRepository = restaurantImageRepository;
		this.restaurantTableRepository = restaurantTableRepository;
		this.restaurantBinaryImageRepository = restaurantBinaryImageRepository;
	}

	@Override
	public Optional<OwnerRestaurantProfileResponse> findByOwnerUserId(Long ownerUserId) {
		List<OwnerRestaurantProfileResponse> rows = jdbcTemplate.query(
				FIND_BY_OWNER,
				(rs, rowNum) -> mapRow(rs),
				ownerUserId
		);
		return rows.stream().findFirst();
	}

	private OwnerRestaurantProfileResponse mapRow(java.sql.ResultSet rs) throws java.sql.SQLException {
		Long restaurantId = rs.getLong("id");
		Time opening = rs.getTime("opening_time");
		Time closing = rs.getTime("closing_time");
		String openingStr = opening != null ? TIME_FORMAT_HH_MM.format(opening.toLocalTime()) : null;
		String closingStr = closing != null ? TIME_FORMAT_HH_MM.format(closing.toLocalTime()) : null;
		BigDecimal pricePerHour = rs.getBigDecimal("price_per_hour");
		String legacyMain = rs.getString("image_url");
		Boolean active = (Boolean) rs.getObject("active");
		return new OwnerRestaurantProfileResponse(
				restaurantId,
				rs.getString("name"),
				rs.getString("city"),
				rs.getString("description"),
				rs.getString("address"),
				rs.getString("phone"),
				(Integer) rs.getObject("capacity"),
				pricePerHour,
				openingStr,
				closingStr,
				buildMainImageUrl(restaurantId, legacyMain),
				buildDetailImageUrls(restaurantId),
				active
		);
	}

	private String buildMainImageUrl(Long restaurantId, String legacyImageUrl) {
		if (restaurantBinaryImageRepository.hasMainBlob(restaurantId)) {
			return "/api/restaurants/" + restaurantId + "/images/main";
		}
		return legacyImageUrl != null && !legacyImageUrl.isBlank() ? legacyImageUrl : null;
	}

	private List<String> buildDetailImageUrls(Long restaurantId) {
		java.util.ArrayList<String> urls = new java.util.ArrayList<>();
		if (restaurantBinaryImageRepository.hasDetail1Blob(restaurantId)) {
			urls.add("/api/restaurants/" + restaurantId + "/images/detail1");
		}
		if (restaurantBinaryImageRepository.hasDetail2Blob(restaurantId)) {
			urls.add("/api/restaurants/" + restaurantId + "/images/detail2");
		}
		if (urls.isEmpty()) {
			return restaurantImageRepository.findDetailImageUrls(restaurantId);
		}
		return urls;
	}

	@Override
	@Transactional
	public OwnerRestaurantProfileResponse insertForOwner(Long ownerUserId, UpdateOwnerRestaurantProfileRequest request) {
		LocalTime opening = parseFlexibleTime(request.openingTime(), "Açılış saati");
		LocalTime closing = parseFlexibleTime(request.closingTime(), "Kapanış saati");
		Long id = jdbcTemplate.queryForObject(
				INSERT_FOR_OWNER,
				Long.class,
				request.name().trim(),
				request.city().trim(),
				request.pricePerHour(),
				ownerUserId,
				nullableText(request.description()),
				nullableText(request.address()),
				nullableText(request.phone()),
				request.capacity(),
				Time.valueOf(opening),
				Time.valueOf(closing)
		);
		if (id == null) {
			throw new IllegalStateException("Restoran kimliği üretilemedi");
		}
		restaurantTableRepository.replaceTables(id, request.capacity());
		return findByOwnerUserId(ownerUserId)
				.orElseThrow(() -> new IllegalStateException("Oluşturulan işletme bulunamadı"));
	}

	@Override
	@Transactional
	public OwnerRestaurantProfileResponse updateByOwnerUserId(Long ownerUserId, UpdateOwnerRestaurantProfileRequest request) {
		LocalTime opening = parseFlexibleTime(request.openingTime(), "Açılış saati");
		LocalTime closing = parseFlexibleTime(request.closingTime(), "Kapanış saati");
		int affected = jdbcTemplate.update(
				UPDATE_BY_OWNER,
				request.name().trim(),
				request.city().trim(),
				nullableText(request.description()),
				nullableText(request.address()),
				nullableText(request.phone()),
				request.capacity(),
				request.pricePerHour(),
				Time.valueOf(opening),
				Time.valueOf(closing),
				ownerUserId
		);
		if (affected == 0) {
			throw new IllegalStateException("İşletme profili güncellenemedi");
		}
		OwnerRestaurantProfileResponse updated = findByOwnerUserId(ownerUserId)
				.orElseThrow(() -> new IllegalStateException("Güncellenen işletme bulunamadı"));
		restaurantImageRepository.replaceDetailImages(updated.restaurantId(), List.of());
		restaurantTableRepository.replaceTables(updated.restaurantId(), request.capacity());
		return findByOwnerUserId(ownerUserId)
				.orElseThrow(() -> new IllegalStateException("Güncellenen işletme bulunamadı"));
	}

	private static LocalTime parseFlexibleTime(String raw, String fieldLabel) {
		if (raw == null) {
			throw new IllegalArgumentException(fieldLabel + " boş olamaz");
		}
		String trimmed = raw.trim();
		if (trimmed.isEmpty()) {
			throw new IllegalArgumentException(fieldLabel + " boş olamaz");
		}
		DateTimeFormatter[] formatters = {
				TIME_FORMAT_HH_MM,
				TIME_FORMAT_H_MM,
				TIME_FORMAT_HH_MM_SS,
				TIME_FORMAT_H_MM_SS
		};
		for (DateTimeFormatter formatter : formatters) {
			try {
				return LocalTime.parse(trimmed, formatter);
			} catch (DateTimeParseException ignored) {
				// try next pattern
			}
		}
		throw new IllegalArgumentException(fieldLabel + " geçersiz (örnek: 09:00 veya 9:00)");
	}

	private static String nullableText(String value) {
		if (value == null) {
			return null;
		}
		String trimmed = value.trim();
		return trimmed.isEmpty() ? null : trimmed;
	}
}
