package com.lezzetly.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record LogoutRequest(
		@NotBlank(message = "Refresh token zorunludur")
		String refreshToken
) {
}
