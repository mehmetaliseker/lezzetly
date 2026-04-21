package com.lezzetly.backend.repository;

import java.time.LocalDate;
import java.util.List;

public interface ReservationSlotRepository {

	List<Integer> findReservedHours(Long restaurantId, LocalDate date, Integer tableNo);

	boolean hasAnyConflict(Long restaurantId, LocalDate date, Integer tableNo, List<Integer> hours);
}
