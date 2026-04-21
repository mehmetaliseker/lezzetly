package com.lezzetly.backend.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.lezzetly.backend.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

	private final String corsAllowedOrigins;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	public SecurityConfig(
			@Value("${app.cors.allowed-origins:http://localhost:3000}") String corsAllowedOrigins,
			JwtAuthenticationFilter jwtAuthenticationFilter
	) {
		this.corsAllowedOrigins = corsAllowedOrigins;
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.csrf(csrf -> csrf.disable())
				.cors(Customizer.withDefaults())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
				.anonymous(Customizer.withDefaults())
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		List<String> configuredPatterns = Arrays.stream(corsAllowedOrigins.split(","))
				.map(String::trim)
				.filter(value -> !value.isEmpty())
				.toList();
		List<String> allowedPatterns = new java.util.ArrayList<>(configuredPatterns);
		allowedPatterns.add("http://localhost:*");
		allowedPatterns.add("http://127.0.0.1:*");

		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOriginPatterns(allowedPatterns);
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(List.of("*"));
		configuration.setExposedHeaders(List.of("Authorization"));
		configuration.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}
