package com.lezzetly.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lezzetly.backend.dto.CreateReservationRequest;
import com.lezzetly.backend.dto.ReservationResponse;
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
	@Operation(summary = "Rezervasyon oluştur (süre ve fiyat sunucuda hesaplanır)")
	public ResponseEntity<ReservationResponse> create(@Valid @RequestBody CreateReservationRequest request) {
		ReservationResponse response = reservationService.create(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}
}
