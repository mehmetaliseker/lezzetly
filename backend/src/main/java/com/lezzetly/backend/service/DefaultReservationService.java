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

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.lezzetly.backend.domain.Reservation;
import com.lezzetly.backend.domain.ReservationStatus;
import com.lezzetly.backend.domain.Restaurant;
import com.lezzetly.backend.dto.CreateReservationRequest;
import com.lezzetly.backend.dto.CustomerReservationCardResponse;
import com.lezzetly.backend.dto.ReservationAvailabilityResponse;
import com.lezzetly.backend.dto.ReservationResponse;
import com.lezzetly.backend.dto.TableAvailabilityResponse;
import com.lezzetly.backend.repository.ReservationRepository;
import com.lezzetly.backend.repository.ReservationSlotRepository;
import com.lezzetly.backend.repository.RestaurantRepository;
import com.lezzetly.backend.repository.RestaurantTableRepository;

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
		validatePastAndBusinessHours(restaurant, request.date(), selectedHours);
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
		Restaurant restaurant = restaurantRepository.findById(restaurantId)
				.filter(Restaurant::active)
				.orElseThrow(() -> new IllegalArgumentException("Restoran bulunamadı veya pasif: " + restaurantId));
		List<Integer> tables = restaurantTableRepository.findActiveTableNumbers(restaurantId);
		List<TableAvailabilityResponse> availability = new ArrayList<>();
		for (Integer tableNo : tables) {
			Set<Integer> disabledHours = new LinkedHashSet<>(reservationSlotRepository.findReservedHours(restaurantId, date, tableNo));
			applyBusinessHourRules(restaurant, date, disabledHours);
			availability.add(new TableAvailabilityResponse(tableNo, disabledHours.stream().sorted().collect(Collectors.toList())));
		}
		return new ReservationAvailabilityResponse(restaurantId, date, availability);
	}

	@Override
	public List<ReservationResponse> listPastForRestaurant(Long userId, Long restaurantId, int limit) {
		List<Reservation> rows = reservationRepository.findPastByUserAndRestaurantLimited(userId, restaurantId, limit);
		return rows.stream().map(DefaultReservationService::toResponse).collect(Collectors.toList());
	}

	@Override
	public List<ReservationResponse> listRecentForRestaurant(Long userId, Long restaurantId, int limit) {
		List<Reservation> rows = reservationRepository.findRecentByUserAndRestaurantLimited(userId, restaurantId, limit);
		return rows.stream().map(DefaultReservationService::toResponse).collect(Collectors.toList());
	}

	@Override
	public List<CustomerReservationCardResponse> listMine(Long userId, int limit) {
		return reservationRepository.findMineByUserLimited(userId, limit);
	}

	@Override
	@Transactional
	public void cancelMyUpcomingReservation(Long userId, Long reservationId) {
		boolean cancelled = reservationRepository.cancelUpcomingByIdAndUser(reservationId, userId);
		if (!cancelled) {
			throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST,
					"Yalnızca yaklaşan rezervasyonlar iptal edilebilir"
			);
		}
	}

	private void applyBusinessHourRules(Restaurant restaurant, LocalDate date, Set<Integer> disabledHours) {
		int firstHour = firstBookableHourInclusive(restaurant.openingTime());
		int lastHour = lastBookableHourInclusive(restaurant.closingTime());
		for (int hour = 0; hour < 24; hour++) {
			if (hour < firstHour || hour > lastHour) {
				disabledHours.add(hour);
			}
		}
		if (LocalDate.now().isEqual(date)) {
			int currentHour = LocalDateTime.now().getHour();
			for (int hour = 0; hour <= currentHour; hour++) {
				disabledHours.add(hour);
			}
		}
	}

	private void validatePastAndBusinessHours(Restaurant restaurant, LocalDate date, List<Integer> selectedHours) {
		int firstHour = firstBookableHourInclusive(restaurant.openingTime());
		int lastHour = lastBookableHourInclusive(restaurant.closingTime());
		for (Integer selectedHour : selectedHours) {
			if (selectedHour < firstHour || selectedHour > lastHour) {
				throw new IllegalArgumentException("Seçilen saatler işletme açılış/kapanış saatleri dışında");
			}
		}
		if (LocalDate.now().isEqual(date)) {
			int currentHour = LocalDateTime.now().getHour();
			for (Integer selectedHour : selectedHours) {
				if (selectedHour <= currentHour) {
					throw new IllegalArgumentException("Bugün için yalnızca bir sonraki saatten itibaren rezervasyon alınabilir");
				}
			}
		}
	}

	private static int firstBookableHourInclusive(LocalTime openingTime) {
		if (openingTime == null) {
			return 0;
		}
		return openingTime.getHour();
	}

	private static int lastBookableHourInclusive(LocalTime closingTime) {
		if (closingTime == null) {
			return 23;
		}
		if (closingTime.getMinute() == 0 && closingTime.getSecond() == 0 && closingTime.getNano() == 0) {
			return Math.max(0, closingTime.getHour() - 1);
		}
		return Math.max(0, closingTime.getHour() - 1);
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
}
