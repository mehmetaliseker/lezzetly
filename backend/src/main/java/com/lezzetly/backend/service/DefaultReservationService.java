package com.lezzetly.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.lezzetly.backend.domain.Reservation;
import com.lezzetly.backend.domain.ReservationStatus;
import com.lezzetly.backend.domain.Restaurant;
import com.lezzetly.backend.dto.CreateReservationRequest;
import com.lezzetly.backend.dto.ReservationAvailabilityResponse;
import com.lezzetly.backend.dto.ReservationResponse;
import com.lezzetly.backend.dto.TableAvailabilityResponse;
import com.lezzetly.backend.repository.ReservationRepository;
import com.lezzetly.backend.repository.ReservationSlotRepository;
import com.lezzetly.backend.repository.RestaurantRepository;
import com.lezzetly.backend.repository.RestaurantTableRepository;

import org.springframework.transaction.annotation.Transactional;

public class DefaultReservationService implements ReservationService {

	private final RestaurantRepository restaurantRepository;
	private final ReservationRepository reservationRepository;
	private final RestaurantTableRepository restaurantTableRepository;
	private final ReservationSlotRepository reservationSlotRepository;

	public DefaultReservationService(
			RestaurantRepository restaurantRepository,
			ReservationRepository reservationRepository,
			RestaurantTableRepository restaurantTableRepository,
			ReservationSlotRepository reservationSlotRepository
	) {
		this.restaurantRepository = restaurantRepository;
		this.reservationRepository = reservationRepository;
		this.restaurantTableRepository = restaurantTableRepository;
		this.reservationSlotRepository = reservationSlotRepository;
	}

	@Override
	@Transactional
	public ReservationResponse create(Long userId, CreateReservationRequest request) {
		Restaurant restaurant = restaurantRepository.findById(request.restaurantId())
				.filter(Restaurant::active)
				.orElseThrow(() -> new IllegalArgumentException("Restoran bulunamadı veya pasif: " + request.restaurantId()));
		List<Integer> activeTables = restaurantTableRepository.findActiveTableNumbers(restaurant.id());
		if (!activeTables.contains(request.tableNo())) {
			throw new IllegalArgumentException("Seçilen masa bu restoranda aktif değil");
		}

		List<Integer> selectedHours = normalizeHours(request.selectedHours());
		validatePastHours(request.date(), selectedHours);
		if (reservationSlotRepository.hasAnyConflict(restaurant.id(), request.date(), request.tableNo(), selectedHours)) {
			throw new IllegalArgumentException("Seçilen saatlerden bazıları dolu");
		}

		long slotCount = selectedHours.size();
		BigDecimal totalPrice = restaurant.pricePerHour().multiply(BigDecimal.valueOf(slotCount));

		Reservation draft = new Reservation(
				null,
				userId,
				restaurant.id(),
				request.tableNo(),
				request.date(),
				selectedHours,
				slotCount,
				totalPrice,
				ReservationStatus.PENDING
		);

		Reservation saved = reservationRepository.save(draft);
		reservationRepository.saveSlots(
				saved.id(),
				saved.restaurantId(),
				saved.date(),
				saved.tableNo(),
				saved.selectedHours()
		);
		return toResponse(saved);
	}

	@Override
	public ReservationAvailabilityResponse availability(Long restaurantId, LocalDate date) {
		restaurantRepository.findById(restaurantId)
				.filter(Restaurant::active)
				.orElseThrow(() -> new IllegalArgumentException("Restoran bulunamadı veya pasif: " + restaurantId));
		List<Integer> tables = restaurantTableRepository.findActiveTableNumbers(restaurantId);
		List<TableAvailabilityResponse> availability = new ArrayList<>();
		for (Integer tableNo : tables) {
			Set<Integer> disabledHours = new LinkedHashSet<>(reservationSlotRepository.findReservedHours(restaurantId, date, tableNo));
			if (LocalDate.now().isEqual(date)) {
				int currentHour = LocalTime.now().getHour();
				for (int hour = 0; hour < currentHour; hour++) {
					disabledHours.add(hour);
				}
			}
			availability.add(new TableAvailabilityResponse(tableNo, disabledHours.stream().sorted().collect(Collectors.toList())));
		}
		return new ReservationAvailabilityResponse(restaurantId, date, availability);
	}

	private static ReservationResponse toResponse(Reservation reservation) {
		return new ReservationResponse(
				reservation.id(),
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

	private static List<Integer> normalizeHours(List<Integer> source) {
		List<Integer> uniqueHours = source.stream()
				.distinct()
				.sorted(Comparator.naturalOrder())
				.toList();
		if (uniqueHours.isEmpty()) {
			throw new IllegalArgumentException("En az bir saat seçilmelidir");
		}
		return uniqueHours;
	}

	private static void validatePastHours(LocalDate date, List<Integer> selectedHours) {
		if (!LocalDate.now().isEqual(date)) {
			return;
		}
		int currentHour = LocalDateTime.now().getHour();
		for (Integer selectedHour : selectedHours) {
			if (selectedHour < currentHour) {
				throw new IllegalArgumentException("Bugün için geçmiş saat seçilemez");
			}
		}
	}
}
