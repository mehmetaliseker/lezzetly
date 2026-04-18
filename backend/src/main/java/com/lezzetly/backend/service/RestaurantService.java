package com.lezzetly.backend.service;

import java.util.List;

import com.lezzetly.backend.dto.RestaurantResponse;

public interface RestaurantService {

	List<RestaurantResponse> listActive();

	RestaurantResponse getById(Long id);
}
