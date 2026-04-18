package com.lezzetly.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "Health", description = "Sağlık kontrolü")
public class HealthController {

	@GetMapping("/api/health")
	@Operation(summary = "Backend sağlık kontrolü")
	public String healthCheck() {
		return "Lezzetly backend is running";
	}
}