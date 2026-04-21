package com.lezzetly.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import com.lezzetly.backend.domain.Restaurant;
import com.lezzetly.backend.dto.RestaurantResponse;
import com.lezzetly.backend.repository.RestaurantImageRepository;
import com.lezzetly.backend.repository.RestaurantRepository;
import com.lezzetly.backend.repository.RestaurantTableRepository;

public final class DefaultRestaurantService implements RestaurantService {

	private final RestaurantRepository restaurantRepository;
	private final RestaurantTableRepository restaurantTableRepository;
	private final RestaurantImageRepository restaurantImageRepository;

	public DefaultRestaurantService(
			RestaurantRepository restaurantRepository,
			RestaurantTableRepository restaurantTableRepository,
			RestaurantImageRepository restaurantImageRepository
	) {
		this.restaurantRepository = restaurantRepository;
		this.restaurantTableRepository = restaurantTableRepository;
		this.restaurantImageRepository = restaurantImageRepository;
	}

	@Override
	public List<RestaurantResponse> listActive() {
		return restaurantRepository.findAllActive().stream()
				.map(this::toResponse)
				.collect(Collectors.toList());
	}

	@Override
	public RestaurantResponse getById(Long id) {
		Restaurant restaurant = restaurantRepository.findById(id)
				.filter(Restaurant::active)
				.orElseThrow(() -> new IllegalArgumentException("Restoran bulunamadı veya pasif: " + id));
		return toResponse(restaurant);
	}

	private RestaurantResponse toResponse(Restaurant restaurant) {
		List<Integer> tables = restaurantTableRepository.findActiveTableNumbers(restaurant.id());
		List<String> detailImages = restaurantImageRepository.findDetailImageUrls(restaurant.id());
		return new RestaurantResponse(
				restaurant.id(),
				restaurant.name(),
				restaurant.city(),
				restaurant.pricePerHour(),
				restaurant.active(),
				tables.size(),
				restaurant.imageUrl(),
				detailImages
		);
	}
}
