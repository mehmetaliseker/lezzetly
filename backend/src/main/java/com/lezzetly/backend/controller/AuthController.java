package com.lezzetly.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lezzetly.backend.dto.auth.AuthResponse;
import com.lezzetly.backend.dto.auth.LoginRequest;
import com.lezzetly.backend.dto.auth.RegisterRequest;
import com.lezzetly.backend.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "Müşteri ve işletme sahibi giriş/kayıt")
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/customer/login")
	@Operation(summary = "Müşteri girişi")
	public AuthResponse loginCustomer(@Valid @RequestBody LoginRequest request) {
		return authService.loginCustomer(request);
	}

	@PostMapping("/customer/register")
	@Operation(summary = "Müşteri kaydı")
	public ResponseEntity<AuthResponse> registerCustomer(@Valid @RequestBody RegisterRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerCustomer(request));
	}

	@PostMapping("/owner/login")
	@Operation(summary = "İşletme sahibi girişi")
	public AuthResponse loginOwner(@Valid @RequestBody LoginRequest request) {
		return authService.loginOwner(request);
	}

	@PostMapping("/owner/register")
	@Operation(summary = "İşletme sahibi kaydı")
	public ResponseEntity<AuthResponse> registerOwner(@Valid @RequestBody RegisterRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerOwner(request));
	}
}
