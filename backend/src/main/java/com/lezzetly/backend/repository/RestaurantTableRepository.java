package com.lezzetly.backend.repository;

import java.util.List;

public interface RestaurantTableRepository {

	List<Integer> findActiveTableNumbers(Long restaurantId);

	void replaceTables(Long restaurantId, Integer capacity);
}
