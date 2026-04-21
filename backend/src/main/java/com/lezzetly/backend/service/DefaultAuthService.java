package com.lezzetly.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import com.lezzetly.backend.domain.RefreshToken;
import com.lezzetly.backend.domain.User;
import com.lezzetly.backend.domain.UserRole;
import com.lezzetly.backend.dto.auth.AuthResponse;
import com.lezzetly.backend.dto.auth.AuthUserResponse;
import com.lezzetly.backend.dto.auth.CurrentUserResponse;
import com.lezzetly.backend.dto.auth.LoginRequest;
import com.lezzetly.backend.dto.auth.RefreshTokenResponse;
import com.lezzetly.backend.dto.auth.RegisterRequest;
import com.lezzetly.backend.dto.auth.TokenPairResponse;
import com.lezzetly.backend.dto.auth.UpdatePasswordRequest;
import com.lezzetly.backend.dto.auth.UpdateProfileRequest;
import com.lezzetly.backend.repository.RefreshTokenRepository;
import com.lezzetly.backend.repository.UserRepository;
import com.lezzetly.backend.security.AuthenticatedUser;
import com.lezzetly.backend.security.JwtService;
import com.lezzetly.backend.security.JwtTokens;
import com.lezzetly.backend.security.TokenHashService;

import java.time.OffsetDateTime;
import org.springframework.transaction.annotation.Transactional;

public class DefaultAuthService implements AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final TokenHashService tokenHashService;
	private final RefreshTokenRepository refreshTokenRepository;
	private final FeatureFlagService featureFlagService;

	public DefaultAuthService(
			UserRepository userRepository,
			PasswordEncoder passwordEncoder,
			JwtService jwtService,
			TokenHashService tokenHashService,
			RefreshTokenRepository refreshTokenRepository,
			FeatureFlagService featureFlagService
	) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
		this.tokenHashService = tokenHashService;
		this.refreshTokenRepository = refreshTokenRepository;
		this.featureFlagService = featureFlagService;
	}

	@Override
	public AuthResponse loginCustomer(LoginRequest request) {
		return loginByRole(request, UserRole.CUSTOMER);
	}

	@Override
	@Transactional
	public AuthResponse registerCustomer(RegisterRequest request) {
		return registerByRole(request, UserRole.CUSTOMER);
	}

	@Override
	public AuthResponse loginOwner(LoginRequest request) {
		return loginByRole(request, UserRole.OWNER);
	}

	@Override
	@Transactional
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
		JwtTokens tokens = jwtService.generateTokens(user);
		persistRefreshToken(user.id(), tokens.refreshToken());
		return new AuthResponse("Giriş başarılı", toResponseUser(user), toTokenPairResponse(tokens));
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
				null,
				passwordEncoder.encode(request.password()),
				role,
				featureFlagService.isAutoVerifyEmailEnabled(),
				null,
				null
		);
		if (featureFlagService.isMockNotificationEnabled()) {
			org.slf4j.LoggerFactory.getLogger(DefaultAuthService.class).info(
					"[mockNotificationEnabled] Kayıt tamamlandı: {}", normalizedEmail
			);
		}
		User persisted = userRepository.save(userToPersist);
		JwtTokens tokens = jwtService.generateTokens(persisted);
		persistRefreshToken(persisted.id(), tokens.refreshToken());
		return new AuthResponse("Kayıt başarılı", toResponseUser(persisted), toTokenPairResponse(tokens));
	}

	@Override
	public RefreshTokenResponse refresh(String refreshToken) {
		AuthenticatedUser refreshUser = jwtService.parseRefreshToken(refreshToken);
		String tokenHash = tokenHashService.hash(refreshToken);
		OffsetDateTime now = OffsetDateTime.now();
		RefreshToken stored = refreshTokenRepository.findActiveByHash(tokenHash, now)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token geçersiz"));
		if (!stored.userId().equals(refreshUser.userId())) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token kullanıcı uyuşmuyor");
		}
		User user = userRepository.findById(refreshUser.userId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Kullanıcı bulunamadı"));
		refreshTokenRepository.revokeByHash(tokenHash, now);
		JwtTokens tokens = jwtService.generateTokens(user);
		persistRefreshToken(user.id(), tokens.refreshToken());
		return new RefreshTokenResponse("Token yenilendi", toTokenPairResponse(tokens));
	}

	@Override
	public void logout(String refreshToken) {
		jwtService.parseRefreshToken(refreshToken);
		String tokenHash = tokenHashService.hash(refreshToken);
		refreshTokenRepository.revokeByHash(tokenHash, OffsetDateTime.now());
	}

	@Override
	public CurrentUserResponse currentUser(Long userId) {
		User user = userRepository.findById(userId)
				.filter(User::active)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Kullanıcı bulunamadı"));
		return new CurrentUserResponse(
				user.id(),
				user.firstName(),
				user.lastName(),
				user.email(),
				user.phone(),
				user.role().name()
		);
	}

	@Override
	@Transactional
	public CurrentUserResponse updateCurrentUser(Long userId, UpdateProfileRequest request) {
		User currentUser = userRepository.findById(userId)
				.filter(User::active)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Kullanıcı bulunamadı"));
		String normalizedEmail = normalizeEmail(request.email());
		if (!currentUser.email().equalsIgnoreCase(normalizedEmail) && userRepository.existsByEmail(normalizedEmail)) {
			throw new IllegalArgumentException("Bu e-posta adresi zaten kayıtlı");
		}
		String phoneValue = request.phone() == null ? null : request.phone().trim();
		if (phoneValue != null && phoneValue.isEmpty()) {
			phoneValue = null;
		}
		User updated = userRepository.updateProfile(
				userId,
				normalizeName(request.firstName(), "Ad"),
				normalizeName(request.lastName(), "Soyad"),
				normalizedEmail,
				phoneValue
		);
		return new CurrentUserResponse(
				updated.id(),
				updated.firstName(),
				updated.lastName(),
				updated.email(),
				updated.phone(),
				updated.role().name()
		);
	}

	@Override
	@Transactional
	public void updatePassword(Long userId, UpdatePasswordRequest request) {
		User currentUser = userRepository.findById(userId)
				.filter(User::active)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Kullanıcı bulunamadı"));
		if (!passwordEncoder.matches(request.currentPassword(), currentUser.passwordHash())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mevcut şifre hatalı");
		}
		if (request.currentPassword().equals(request.newPassword())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Yeni şifre mevcut şifre ile aynı olamaz");
		}
		userRepository.updatePasswordHash(userId, passwordEncoder.encode(request.newPassword()));
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
				user.phone(),
				user.role().name()
		);
	}

	private void persistRefreshToken(Long userId, String refreshToken) {
		String tokenHash = tokenHashService.hash(refreshToken);
		OffsetDateTime expiresAt = jwtService.readRefreshTokenExpiry(refreshToken);
		refreshTokenRepository.save(userId, tokenHash, expiresAt);
	}

	private static TokenPairResponse toTokenPairResponse(JwtTokens tokens) {
		return new TokenPairResponse(
				tokens.accessToken(),
				tokens.refreshToken(),
				tokens.accessTokenExpiresInSeconds(),
				tokens.refreshTokenExpiresInSeconds()
		);
	}

	private static ResponseStatusException invalidCredentials() {
		return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-posta veya şifre hatalı");
	}
}
