package com.lezzetly.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
		@NotBlank(message = "Ad zorunludur")
		@Size(max = 80, message = "Ad en fazla 80 karakter olabilir")
		String firstName,
		@NotBlank(message = "Soyad zorunludur")
		@Size(max = 80, message = "Soyad en fazla 80 karakter olabilir")
		String lastName,
		@Email(message = "Geçerli bir e-posta giriniz")
		@NotBlank(message = "E-posta zorunludur")
		@Size(max = 255, message = "E-posta en fazla 255 karakter olabilir")
		String email,
		@NotBlank(message = "Şifre zorunludur")
		@Size(min = 6, max = 72, message = "Şifre 6-72 karakter aralığında olmalıdır")
		String password
) {
}
