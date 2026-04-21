package com.lezzetly.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(
		@NotBlank(message = "Refresh token zorunludur")
		String refreshToken
) {
}
