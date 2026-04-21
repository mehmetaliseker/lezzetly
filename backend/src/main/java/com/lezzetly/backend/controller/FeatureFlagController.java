package com.lezzetly.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lezzetly.backend.dto.FeatureFlagResponse;
import com.lezzetly.backend.service.FeatureFlagService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/feature-flags")
@Tag(name = "Feature flags", description = "İstemci tarafı özellik bayrakları")
public class FeatureFlagController {

	private final FeatureFlagService featureFlagService;

	public FeatureFlagController(FeatureFlagService featureFlagService) {
		this.featureFlagService = featureFlagService;
	}

	@GetMapping
	@Operation(summary = "Genel özellik bayraklarını listele")
	public List<FeatureFlagResponse> list() {
		return featureFlagService.listPublicFlags();
	}
}
