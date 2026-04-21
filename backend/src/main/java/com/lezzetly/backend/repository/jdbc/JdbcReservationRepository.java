package com.lezzetly.backend.repository.jdbc;

import java.sql.Date;
import java.util.Arrays;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.lezzetly.backend.domain.Reservation;
import com.lezzetly.backend.domain.ReservationStatus;
import com.lezzetly.backend.repository.ReservationRepository;

@Repository
public class JdbcReservationRepository implements ReservationRepository {

	private static final String INSERT_RESERVATION = """
			INSERT INTO reservations (user_id, restaurant_id, table_no, reservation_date, slot_count, total_price, status)
			VALUES (?, ?, ?, ?, ?, ?, ?)
			RETURNING id
			""";

	private static final String INSERT_SLOT = """
			INSERT INTO reservation_slots (reservation_id, restaurant_id, reservation_date, table_no, slot_hour)
			VALUES (?, ?, ?, ?, ?)
			""";

	private static final String FIND_PAST_BY_USER_RESTAURANT = """
			SELECT r.id, r.user_id, r.restaurant_id, r.table_no, r.reservation_date, r.slot_count, r.total_price, r.status,
			       STRING_AGG(CAST(rs.slot_hour AS VARCHAR), ',' ORDER BY rs.slot_hour) AS hours_csv
			FROM reservations r
			JOIN reservation_slots rs ON rs.reservation_id = r.id
			WHERE r.user_id = ? AND r.restaurant_id = ? AND r.status <> 'CANCELLED'
			GROUP BY r.id, r.user_id, r.restaurant_id, r.table_no, r.reservation_date, r.slot_count, r.total_price, r.status
			HAVING r.reservation_date < CURRENT_DATE
			    OR (
			      r.reservation_date = CURRENT_DATE
			      AND MAX(rs.slot_hour) < EXTRACT(HOUR FROM CURRENT_TIMESTAMP)
			    )
			ORDER BY r.reservation_date DESC, r.id DESC
			LIMIT ?
			""";

	private final JdbcTemplate jdbcTemplate;

	public JdbcReservationRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	public Reservation save(Reservation reservation) {
		Long id = jdbcTemplate.queryForObject(
				INSERT_RESERVATION,
				Long.class,
				reservation.userId(),
				reservation.restaurantId(),
				reservation.tableNo(),
				Date.valueOf(reservation.date()),
				reservation.slotCount(),
				reservation.totalPrice(),
				reservation.status().name()
		);
		if (id == null) {
			throw new IllegalStateException("Rezervasyon kimliği üretilemedi");
		}
		return new Reservation(
				id,
				reservation.userId(),
				reservation.restaurantId(),
				reservation.tableNo(),
				reservation.date(),
				reservation.selectedHours(),
				reservation.slotCount(),
				reservation.totalPrice(),
				reservation.status()
		);
	}

	@Override
	@Transactional
	public void saveSlots(Long reservationId, Long restaurantId, java.time.LocalDate date, Integer tableNo, List<Integer> selectedHours) {
		for (Integer selectedHour : selectedHours) {
			jdbcTemplate.update(INSERT_SLOT, reservationId, restaurantId, Date.valueOf(date), tableNo, selectedHour);
		}
	}

	@Override
	public List<Reservation> findPastByUserAndRestaurantLimited(Long userId, Long restaurantId, int limit) {
		return jdbcTemplate.query(
				FIND_PAST_BY_USER_RESTAURANT,
				(rs, rowNum) -> {
					String csv = rs.getString("hours_csv");
					List<Integer> hours = parseHoursCsv(csv);
					return new Reservation(
							rs.getLong("id"),
							rs.getLong("user_id"),
							rs.getLong("restaurant_id"),
							rs.getInt("table_no"),
							rs.getObject("reservation_date", java.time.LocalDate.class),
							hours,
							rs.getLong("slot_count"),
							rs.getBigDecimal("total_price"),
							ReservationStatus.valueOf(rs.getString("status"))
					);
				},
				userId,
				restaurantId,
				limit
		);
	}

	private static List<Integer> parseHoursCsv(String csv) {
		if (csv == null || csv.isBlank()) {
			return List.of();
		}
		return Arrays.stream(csv.split(","))
				.map(String::trim)
				.filter(part -> !part.isEmpty())
				.map(Integer::parseInt)
				.toList();
	}
}
