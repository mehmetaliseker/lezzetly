package com.lezzetly.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.lezzetly.backend.repository.ReservationRepository;
import com.lezzetly.backend.repository.RestaurantRepository;
import com.lezzetly.backend.repository.memory.InMemoryReservationRepository;
import com.lezzetly.backend.repository.memory.InMemoryRestaurantRepository;
import com.lezzetly.backend.service.DefaultFeatureFlagService;
import com.lezzetly.backend.service.DefaultReservationService;
import com.lezzetly.backend.service.DefaultRestaurantService;
import com.lezzetly.backend.service.FeatureFlagService;
import com.lezzetly.backend.service.ReservationService;
import com.lezzetly.backend.service.RestaurantService;

@Configuration
public class ApplicationBeans {

	@Bean
	public RestaurantRepository restaurantRepository() {
		return new InMemoryRestaurantRepository();
	}

	@Bean
	public ReservationRepository reservationRepository() {
		return new InMemoryReservationRepository();
	}

	@Bean
	public RestaurantService restaurantService(RestaurantRepository restaurantRepository) {
		return new DefaultRestaurantService(restaurantRepository);
	}

	@Bean
	public ReservationService reservationService(
			RestaurantRepository restaurantRepository,
			ReservationRepository reservationRepository
	) {
		return new DefaultReservationService(restaurantRepository, reservationRepository);
	}

	@Bean
	public FeatureFlagService featureFlagService() {
		return new DefaultFeatureFlagService();
	}
}
