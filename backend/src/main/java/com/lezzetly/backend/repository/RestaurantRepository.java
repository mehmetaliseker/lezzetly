package com.lezzetly.backend.repository;

import java.util.List;
import java.util.Optional;

import com.lezzetly.backend.domain.Restaurant;

public interface RestaurantRepository {

	List<Restaurant> findAllActive();

	Optional<Restaurant> findById(Long id);
}
