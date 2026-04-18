package com.lezzetly.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;

import com.lezzetly.backend.domain.Reservation;
import com.lezzetly.backend.domain.ReservationStatus;
import com.lezzetly.backend.domain.Restaurant;
import com.lezzetly.backend.dto.CreateReservationRequest;
import com.lezzetly.backend.dto.ReservationResponse;
import com.lezzetly.backend.repository.ReservationRepository;
import com.lezzetly.backend.repository.RestaurantRepository;

public final class DefaultReservationService implements ReservationService {

	private final RestaurantRepository restaurantRepository;
	private final ReservationRepository reservationRepository;

	public DefaultReservationService(
			RestaurantRepository restaurantRepository,
			ReservationRepository reservationRepository
	) {
		this.restaurantRepository = restaurantRepository;
		this.reservationRepository = reservationRepository;
	}

	@Override
	public ReservationResponse create(CreateReservationRequest request) {
		Restaurant restaurant = restaurantRepository.findById(request.restaurantId())
				.filter(Restaurant::active)
				.orElseThrow(() -> new IllegalArgumentException("Restoran bulunamadı veya pasif: " + request.restaurantId()));

		LocalDateTime start = request.date().atTime(request.startTime());
		LocalDateTime end = request.date().atTime(request.endTime());
		if (!end.isAfter(start)) {
			throw new IllegalArgumentException("Bitiş saati başlangıç saatinden sonra olmalıdır");
		}

		long durationMinutes = Duration.between(start, end).toMinutes();
		BigDecimal hours = BigDecimal.valueOf(durationMinutes)
				.divide(BigDecimal.valueOf(60), 10, RoundingMode.HALF_UP);
		BigDecimal totalPrice = restaurant.pricePerHour()
				.multiply(hours)
				.setScale(2, RoundingMode.HALF_UP);

		Reservation draft = new Reservation(
				null,
				restaurant.id(),
				request.date(),
				request.startTime(),
				request.endTime(),
				durationMinutes,
				totalPrice,
				ReservationStatus.PENDING
		);

		Reservation saved = reservationRepository.save(draft);
		return toResponse(saved);
	}

	private static ReservationResponse toResponse(Reservation reservation) {
		return new ReservationResponse(
				reservation.id(),
				reservation.restaurantId(),
				reservation.date(),
				reservation.startTime(),
				reservation.endTime(),
				reservation.durationMinutes(),
				reservation.totalPrice(),
				reservation.status()
		);
	}
}
