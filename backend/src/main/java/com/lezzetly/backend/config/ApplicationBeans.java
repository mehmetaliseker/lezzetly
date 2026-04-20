package com.lezzetly.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.lezzetly.backend.repository.ReservationRepository;
import com.lezzetly.backend.repository.RestaurantRepository;
import com.lezzetly.backend.repository.UserRepository;
import com.lezzetly.backend.repository.memory.InMemoryReservationRepository;
import com.lezzetly.backend.service.AuthService;
import com.lezzetly.backend.service.DefaultAuthService;
import com.lezzetly.backend.service.DefaultFeatureFlagService;
import com.lezzetly.backend.service.DefaultReservationService;
import com.lezzetly.backend.service.DefaultRestaurantService;
import com.lezzetly.backend.service.FeatureFlagService;
import com.lezzetly.backend.service.ReservationService;
import com.lezzetly.backend.service.RestaurantService;

@Configuration
public class ApplicationBeans {

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

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthService authService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return new DefaultAuthService(userRepository, passwordEncoder);
	}
}
