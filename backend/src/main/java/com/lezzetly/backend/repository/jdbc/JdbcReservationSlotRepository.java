package com.lezzetly.backend.repository.jdbc;

import java.sql.Date;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.lezzetly.backend.repository.ReservationSlotRepository;

@Repository
public class JdbcReservationSlotRepository implements ReservationSlotRepository {

	private static final String FIND_RESERVED_HOURS = """
			SELECT slot_hour
			FROM reservation_slots
			WHERE restaurant_id = ? AND reservation_date = ? AND table_no = ?
			ORDER BY slot_hour
			""";

	private static final String COUNT_CONFLICTS = """
			SELECT COUNT(*)
			FROM reservation_slots
			WHERE restaurant_id = ?
			  AND reservation_date = ?
			  AND table_no = ?
			  AND slot_hour = ANY (?)
			""";

	private final JdbcTemplate jdbcTemplate;

	public JdbcReservationSlotRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	public List<Integer> findReservedHours(Long restaurantId, java.time.LocalDate date, Integer tableNo) {
		return jdbcTemplate.queryForList(FIND_RESERVED_HOURS, Integer.class, restaurantId, Date.valueOf(date), tableNo);
	}

	@Override
	public boolean hasAnyConflict(Long restaurantId, java.time.LocalDate date, Integer tableNo, List<Integer> hours) {
		Integer[] hourArray = hours.toArray(new Integer[0]);
		Integer conflictCount = jdbcTemplate.queryForObject(
				COUNT_CONFLICTS,
				Integer.class,
				restaurantId,
				Date.valueOf(date),
				tableNo,
				hourArray
		);
		return conflictCount != null && conflictCount > 0;
	}
}
