package com.lezzetly.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import com.lezzetly.backend.domain.Restaurant;
import com.lezzetly.backend.dto.RestaurantResponse;
import com.lezzetly.backend.repository.RestaurantRepository;

public final class DefaultRestaurantService implements RestaurantService {

	private final RestaurantRepository restaurantRepository;

	public DefaultRestaurantService(RestaurantRepository restaurantRepository) {
		this.restaurantRepository = restaurantRepository;
	}

	@Override
	public List<RestaurantResponse> listActive() {
		return restaurantRepository.findAllActive().stream()
				.map(DefaultRestaurantService::toResponse)
				.collect(Collectors.toList());
	}

	@Override
	public RestaurantResponse getById(Long id) {
		Restaurant restaurant = restaurantRepository.findById(id)
				.filter(Restaurant::active)
				.orElseThrow(() -> new IllegalArgumentException("Restoran bulunamadı veya pasif: " + id));
		return toResponse(restaurant);
	}

	private static RestaurantResponse toResponse(Restaurant restaurant) {
		return new RestaurantResponse(
				restaurant.id(),
				restaurant.name(),
				restaurant.city(),
				restaurant.pricePerHour(),
				restaurant.active()
		);
	}
}
