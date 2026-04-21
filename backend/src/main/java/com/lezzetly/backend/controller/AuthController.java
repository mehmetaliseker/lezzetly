package com.lezzetly.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lezzetly.backend.dto.auth.AuthResponse;
import com.lezzetly.backend.dto.auth.CurrentUserResponse;
import com.lezzetly.backend.dto.auth.LoginRequest;
import com.lezzetly.backend.dto.auth.LogoutRequest;
import com.lezzetly.backend.dto.auth.RefreshTokenRequest;
import com.lezzetly.backend.dto.auth.RefreshTokenResponse;
import com.lezzetly.backend.dto.auth.RegisterRequest;
import com.lezzetly.backend.dto.auth.UpdatePasswordRequest;
import com.lezzetly.backend.dto.auth.UpdateProfileRequest;
import com.lezzetly.backend.security.JwtPrincipal;
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

	@PostMapping("/refresh")
	@Operation(summary = "Refresh token ile erişim tokenını yenile")
	public RefreshTokenResponse refresh(@Valid @RequestBody RefreshTokenRequest request) {
		return authService.refresh(request.refreshToken());
	}

	@PostMapping("/logout")
	@Operation(summary = "Refresh token'ı sonlandır")
	public ResponseEntity<Void> logout(@Valid @RequestBody LogoutRequest request) {
		authService.logout(request.refreshToken());
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/me")
	@Operation(summary = "Giriş yapan kullanıcı bilgisi")
	public CurrentUserResponse me(@AuthenticationPrincipal JwtPrincipal principal) {
		if (principal == null) {
			throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED, "Oturum gerekli");
		}
		return authService.currentUser(principal.user().userId());
	}

	@PatchMapping("/me")
	@Operation(summary = "Giriş yapan kullanıcı profilini güncelle")
	public CurrentUserResponse updateMe(
			@AuthenticationPrincipal JwtPrincipal principal,
			@Valid @RequestBody UpdateProfileRequest request
	) {
		if (principal == null) {
			throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED, "Oturum gerekli");
		}
		return authService.updateCurrentUser(principal.user().userId(), request);
	}

	@PostMapping("/me/password")
	@Operation(summary = "Giriş yapan kullanıcının şifresini güncelle")
	public ResponseEntity<Void> updatePassword(
			@AuthenticationPrincipal JwtPrincipal principal,
			@Valid @RequestBody UpdatePasswordRequest request
	) {
		if (principal == null) {
			throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED, "Oturum gerekli");
		}
		authService.updatePassword(principal.user().userId(), request);
		return ResponseEntity.noContent().build();
	}
}
