package com.lezzetly.backend.controller;

import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lezzetly.backend.dto.CreateReservationRequest;
import com.lezzetly.backend.dto.ReservationAvailabilityResponse;
import com.lezzetly.backend.dto.ReservationResponse;
import com.lezzetly.backend.security.JwtPrincipal;
import com.lezzetly.backend.service.ReservationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reservations")
@Tag(name = "Reservations", description = "Rezervasyon oluşturma")
public class ReservationController {

	private final ReservationService reservationService;

	public ReservationController(ReservationService reservationService) {
		this.reservationService = reservationService;
	}

	@PostMapping
	@Operation(summary = "Rezervasyon oluştur (masa ve çoklu saat seçimi ile)")
	public ResponseEntity<ReservationResponse> create(
			@AuthenticationPrincipal JwtPrincipal principal,
			@Valid @RequestBody CreateReservationRequest request
	) {
		if (principal == null) {
			throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED, "Oturum gerekli");
		}
		ReservationResponse response = reservationService.create(principal.user().userId(), request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@GetMapping("/availability/{restaurantId}")
	@Operation(summary = "Restorana göre masa bazlı saat müsaitliği")
	public ReservationAvailabilityResponse availability(
			@PathVariable Long restaurantId,
			@RequestParam LocalDate date
	) {
		return reservationService.availability(restaurantId, date);
	}
}
