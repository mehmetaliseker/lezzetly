package com.lezzetly.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdatePasswordRequest(
		@NotBlank(message = "Mevcut şifre zorunludur")
		String currentPassword,
		@NotBlank(message = "Yeni şifre zorunludur")
		@Size(min = 6, max = 72, message = "Yeni şifre 6-72 karakter aralığında olmalıdır")
		String newPassword
) {
}
