package com.lezzetly.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import com.lezzetly.backend.domain.User;
import com.lezzetly.backend.domain.UserRole;
import com.lezzetly.backend.dto.auth.AuthResponse;
import com.lezzetly.backend.dto.auth.AuthUserResponse;
import com.lezzetly.backend.dto.auth.LoginRequest;
import com.lezzetly.backend.dto.auth.RegisterRequest;
import com.lezzetly.backend.repository.UserRepository;

public final class DefaultAuthService implements AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public DefaultAuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public AuthResponse loginCustomer(LoginRequest request) {
		return loginByRole(request, UserRole.CUSTOMER);
	}

	@Override
	public AuthResponse registerCustomer(RegisterRequest request) {
		return registerByRole(request, UserRole.CUSTOMER);
	}

	@Override
	public AuthResponse loginOwner(LoginRequest request) {
		return loginByRole(request, UserRole.OWNER);
	}

	@Override
	public AuthResponse registerOwner(RegisterRequest request) {
		return registerByRole(request, UserRole.OWNER);
	}

	private AuthResponse loginByRole(LoginRequest request, UserRole expectedRole) {
		String normalizedEmail = normalizeEmail(request.email());
		User user = userRepository.findActiveByEmail(normalizedEmail)
				.orElseThrow(() -> invalidCredentials());
		if (user.role() != expectedRole) {
			throw invalidCredentials();
		}
		if (!passwordEncoder.matches(request.password(), user.passwordHash())) {
			throw invalidCredentials();
		}
		return new AuthResponse("Giriş başarılı", toResponseUser(user));
	}

	private AuthResponse registerByRole(RegisterRequest request, UserRole role) {
		String normalizedEmail = normalizeEmail(request.email());
		if (userRepository.existsByEmail(normalizedEmail)) {
			throw new IllegalArgumentException("Bu e-posta adresi zaten kayıtlı");
		}

		User userToPersist = new User(
				null,
				normalizeName(request.firstName(), "Ad"),
				normalizeName(request.lastName(), "Soyad"),
				normalizedEmail,
				passwordEncoder.encode(request.password()),
				role,
				true,
				null,
				null
		);
		User persisted = userRepository.save(userToPersist);
		return new AuthResponse("Kayıt başarılı", toResponseUser(persisted));
	}

	private static String normalizeEmail(String email) {
		String normalized = email == null ? "" : email.trim().toLowerCase();
		if (normalized.isEmpty()) {
			throw new IllegalArgumentException("E-posta zorunludur");
		}
		return normalized;
	}

	private static String normalizeName(String value, String label) {
		String normalized = value == null ? "" : value.trim();
		if (normalized.isEmpty()) {
			throw new IllegalArgumentException(label + " zorunludur");
		}
		return normalized;
	}

	private static AuthUserResponse toResponseUser(User user) {
		return new AuthUserResponse(
				user.id(),
				user.firstName(),
				user.lastName(),
				user.email(),
				user.role().name()
		);
	}

	private static ResponseStatusException invalidCredentials() {
		return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-posta veya şifre hatalı");
	}
}
