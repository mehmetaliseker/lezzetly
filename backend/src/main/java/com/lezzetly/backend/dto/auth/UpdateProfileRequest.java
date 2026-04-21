package com.lezzetly.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
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
		@Size(max = 40, message = "Telefon en fazla 40 karakter olabilir")
		String phone
) {
}
