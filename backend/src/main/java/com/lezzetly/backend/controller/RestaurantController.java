package com.lezzetly.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lezzetly.backend.dto.RestaurantResponse;
import com.lezzetly.backend.service.RestaurantService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/restaurants")
@Tag(name = "Restaurants", description = "Restoran listeleme ve detay")
public class RestaurantController {

	private final RestaurantService restaurantService;

	public RestaurantController(RestaurantService restaurantService) {
		this.restaurantService = restaurantService;
	}

	@GetMapping
	@Operation(summary = "Aktif restoranları listele")
	public List<RestaurantResponse> list() {
		return restaurantService.listActive();
	}

	@GetMapping("/{id}")
	@Operation(summary = "Restoran detayı")
	public RestaurantResponse get(@PathVariable Long id) {
		return restaurantService.getById(id);
	}
}
