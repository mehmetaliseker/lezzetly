package com.lezzetly.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
		@Email(message = "Geçerli bir e-posta giriniz")
		@NotBlank(message = "E-posta zorunludur")
		String email,
		@NotBlank(message = "Şifre zorunludur")
		String password
) {
}
