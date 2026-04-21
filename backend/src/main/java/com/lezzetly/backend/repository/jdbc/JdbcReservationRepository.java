package com.lezzetly.backend.repository.jdbc;

import java.sql.Date;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.lezzetly.backend.domain.Reservation;
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
}
