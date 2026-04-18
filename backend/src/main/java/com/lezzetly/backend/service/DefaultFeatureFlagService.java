package com.lezzetly.backend.service;

import java.util.List;

import com.lezzetly.backend.dto.FeatureFlagResponse;

public final class DefaultFeatureFlagService implements FeatureFlagService {

	@Override
	public List<FeatureFlagResponse> listPublicFlags() {
		return List.of(
				new FeatureFlagResponse(
						"RESERVATION_FLOW_V1",
						true,
						"Rezervasyon çekirdek akışı (v1)"
				),
				new FeatureFlagResponse(
						"ADMIN_PANEL_V1",
						false,
						"Admin paneli (devre dışı)"
				)
		);
	}
}
