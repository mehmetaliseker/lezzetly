package com.lezzetly.backend.security;

import java.security.Key;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lezzetly.backend.domain.User;
import com.lezzetly.backend.domain.UserRole;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private final Key signingKey;
	private final long accessTokenTtlSeconds;
	private final long refreshTokenTtlSeconds;
	private final String issuer;

	public JwtService(
			@Value("${app.jwt.secret}") String secret,
			@Value("${app.jwt.access-token-ttl-seconds:900}") long accessTokenTtlSeconds,
			@Value("${app.jwt.refresh-token-ttl-seconds:1209600}") long refreshTokenTtlSeconds,
			@Value("${app.jwt.issuer:lezzetly}") String issuer
	) {
		byte[] secretBytes = Decoders.BASE64.decode(secret);
		SecretKey key = Keys.hmacShaKeyFor(secretBytes);
		this.signingKey = key;
		this.accessTokenTtlSeconds = accessTokenTtlSeconds;
		this.refreshTokenTtlSeconds = refreshTokenTtlSeconds;
		this.issuer = issuer;
	}

	public JwtTokens generateTokens(User user) {
		String accessToken = buildToken(user, "access", accessTokenTtlSeconds);
		String refreshToken = buildToken(user, "refresh", refreshTokenTtlSeconds);
		return new JwtTokens(accessToken, refreshToken, accessTokenTtlSeconds, refreshTokenTtlSeconds);
	}

	public AuthenticatedUser parseAccessToken(String token) {
		Claims claims = parse(token);
		String type = claims.get("type", String.class);
		if (!"access".equals(type)) {
			throw new IllegalArgumentException("Token tipi access olmalıdır");
		}
		return toAuthenticatedUser(claims);
	}

	public AuthenticatedUser parseRefreshToken(String token) {
		Claims claims = parse(token);
		String type = claims.get("type", String.class);
		if (!"refresh".equals(type)) {
			throw new IllegalArgumentException("Token tipi refresh olmalıdır");
		}
		return toAuthenticatedUser(claims);
	}

	public OffsetDateTime readRefreshTokenExpiry(String token) {
		Claims claims = parse(token);
		String type = claims.get("type", String.class);
		if (!"refresh".equals(type)) {
			throw new IllegalArgumentException("Token tipi refresh olmalıdır");
		}
		return claims.getExpiration().toInstant().atOffset(ZoneOffset.UTC);
	}

	private String buildToken(User user, String type, long ttlSeconds) {
		Instant now = Instant.now();
		Instant expiry = now.plusSeconds(ttlSeconds);
		return Jwts.builder()
				.issuer(issuer)
				.subject(String.valueOf(user.id()))
				.claim("userId", user.id())
				.claim("email", user.email())
				.claim("firstName", user.firstName())
				.claim("lastName", user.lastName())
				.claim("role", user.role().name())
				.claim("type", type)
				.id(UUID.randomUUID().toString())
				.issuedAt(Date.from(now))
				.expiration(Date.from(expiry))
				.signWith(signingKey)
				.compact();
	}

	private Claims parse(String token) {
		return Jwts.parser()
				.verifyWith((SecretKey) signingKey)
				.requireIssuer(issuer)
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}

	private static AuthenticatedUser toAuthenticatedUser(Claims claims) {
		Long userId = claims.get("userId", Long.class);
		String email = claims.get("email", String.class);
		String firstName = claims.get("firstName", String.class);
		String lastName = claims.get("lastName", String.class);
		String role = claims.get("role", String.class);
		if (userId == null || email == null || firstName == null || lastName == null || role == null) {
			throw new IllegalArgumentException("Token içeriği geçersiz");
		}
		return new AuthenticatedUser(userId, email, firstName, lastName, UserRole.valueOf(role));
	}
}
