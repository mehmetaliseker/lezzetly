package com.lezzetly.backend.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateOwnerRestaurantProfileRequest(
		@NotBlank(message = "Restoran adı zorunludur")
		@Size(max = 200, message = "Restoran adı en fazla 200 karakter olabilir")
		String name,
		@NotBlank(message = "Şehir zorunludur")
		@Size(max = 120, message = "Şehir en fazla 120 karakter olabilir")
		String city,
		@Size(max = 2000, message = "Açıklama en fazla 2000 karakter olabilir")
		String description,
		@Size(max = 500, message = "Adres en fazla 500 karakter olabilir")
		String address,
		@Size(max = 40, message = "Telefon en fazla 40 karakter olabilir")
		String phone,
		@NotNull(message = "Masa sayısı zorunludur")
		Integer capacity,
		@NotNull(message = "Saatlik ücret zorunludur")
		BigDecimal pricePerHour,
		@NotBlank(message = "Açılış saati zorunludur")
		String openingTime,
		@NotBlank(message = "Kapanış saati zorunludur")
		String closingTime
) {
}
