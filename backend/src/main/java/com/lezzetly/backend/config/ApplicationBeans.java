package com.lezzetly.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.lezzetly.backend.repository.ReservationRepository;
import com.lezzetly.backend.repository.RestaurantRepository;
import com.lezzetly.backend.repository.RestaurantImageRepository;
import com.lezzetly.backend.repository.RestaurantTableRepository;
import com.lezzetly.backend.repository.ReservationSlotRepository;
import com.lezzetly.backend.repository.OwnerRestaurantProfileRepository;
import com.lezzetly.backend.repository.RestaurantBinaryImageRepository;
import com.lezzetly.backend.repository.RefreshTokenRepository;
import com.lezzetly.backend.repository.UserRepository;
import com.lezzetly.backend.security.JwtService;
import com.lezzetly.backend.security.TokenHashService;
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
	public RestaurantService restaurantService(
			RestaurantRepository restaurantRepository,
			RestaurantTableRepository restaurantTableRepository,
			RestaurantImageRepository restaurantImageRepository,
			RestaurantBinaryImageRepository restaurantBinaryImageRepository,
			OwnerRestaurantProfileRepository ownerRestaurantProfileRepository,
			UserRepository userRepository
	) {
		return new DefaultRestaurantService(
				restaurantRepository,
				restaurantTableRepository,
				restaurantImageRepository,
				restaurantBinaryImageRepository,
				ownerRestaurantProfileRepository,
				userRepository
		);
	}

	@Bean
	public ReservationService reservationService(
			RestaurantRepository restaurantRepository,
			ReservationRepository reservationRepository,
			RestaurantTableRepository restaurantTableRepository,
			ReservationSlotRepository reservationSlotRepository
	) {
		return new DefaultReservationService(
				restaurantRepository,
				reservationRepository,
				restaurantTableRepository,
				reservationSlotRepository
		);
	}

	@Bean
	public FeatureFlagService featureFlagService(
			@Value("${app.feature-flags.auto-verify-email:true}") boolean autoVerifyEmail,
			@Value("${app.feature-flags.mock-notification-enabled:false}") boolean mockNotificationEnabled,
			@Value("${app.feature-flags.profile-password-visibility-toggle:false}") boolean profilePasswordVisibilityToggle,
			@Value("${app.features.profile-password-change-enabled:true}") boolean profilePasswordChangeEnabled
	) {
		return new DefaultFeatureFlagService(
				autoVerifyEmail,
				mockNotificationEnabled,
				profilePasswordVisibilityToggle,
				profilePasswordChangeEnabled
		);
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthService authService(
			UserRepository userRepository,
			PasswordEncoder passwordEncoder,
			JwtService jwtService,
			TokenHashService tokenHashService,
			RefreshTokenRepository refreshTokenRepository,
			FeatureFlagService featureFlagService
	) {
		return new DefaultAuthService(
				userRepository,
				passwordEncoder,
				jwtService,
				tokenHashService,
				refreshTokenRepository,
				featureFlagService
		);
	}
}
