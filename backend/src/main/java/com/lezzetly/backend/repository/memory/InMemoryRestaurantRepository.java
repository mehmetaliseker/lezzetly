package com.lezzetly.backend.repository.memory;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import com.lezzetly.backend.domain.Restaurant;
import com.lezzetly.backend.repository.RestaurantRepository;

public final class InMemoryRestaurantRepository implements RestaurantRepository {

	private final Map<Long, Restaurant> storage = new ConcurrentHashMap<>();

	public InMemoryRestaurantRepository() {
		storage.put(1L, new Restaurant(1L, "Deniz Feneri", "İzmir", new BigDecimal("450.00"), true));
		storage.put(2L, new Restaurant(2L, "Tarihi Konak", "Ankara", new BigDecimal("380.50"), true));
	}

	@Override
	public List<Restaurant> findAllActive() {
		return storage.values().stream()
				.filter(Restaurant::active)
				.collect(Collectors.toList());
	}

	@Override
	public Optional<Restaurant> findById(Long id) {
		return Optional.ofNullable(storage.get(id));
	}
}
