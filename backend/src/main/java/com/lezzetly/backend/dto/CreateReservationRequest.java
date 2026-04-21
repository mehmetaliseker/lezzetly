package com.lezzetly.backend.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record CreateReservationRequest(
		@NotNull(message = "restaurantId zorunludur")
		Long restaurantId,
		@NotNull(message = "date zorunludur")
		LocalDate date,
		@NotNull(message = "tableNo zorunludur")
		@Min(value = 1, message = "Masa numarası en az 1 olmalıdır")
		Integer tableNo,
		@NotEmpty(message = "En az bir saat seçilmelidir")
		List<@NotNull(message = "Saat değeri boş olamaz") @Min(value = 0, message = "Saat 0-23 aralığında olmalı") @Max(value = 23, message = "Saat 0-23 aralığında olmalı") Integer> selectedHours
) {
}
