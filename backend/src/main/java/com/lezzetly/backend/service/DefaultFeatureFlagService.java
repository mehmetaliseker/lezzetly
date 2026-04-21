package com.lezzetly.backend.service;

import java.util.List;

import com.lezzetly.backend.dto.FeatureFlagResponse;

public class DefaultFeatureFlagService implements FeatureFlagService {

	private final boolean autoVerifyEmail;
	private final boolean mockNotificationEnabled;

	public DefaultFeatureFlagService(
			boolean autoVerifyEmail,
			boolean mockNotificationEnabled
	) {
		this.autoVerifyEmail = autoVerifyEmail;
		this.mockNotificationEnabled = mockNotificationEnabled;
	}

	@Override
	public List<FeatureFlagResponse> listPublicFlags() {
		return List.of(
				new FeatureFlagResponse(
						"AUTO_VERIFY_EMAIL",
						autoVerifyEmail,
						"E-posta doğrulamayı otomatik aktif eder"
				),
				new FeatureFlagResponse(
						"MOCK_NOTIFICATION_ENABLED",
						mockNotificationEnabled,
						"Geliştirme ortamı için bildirim mock modu"
				)
		);
	}

	@Override
	public boolean isAutoVerifyEmailEnabled() {
		return autoVerifyEmail;
	}

	@Override
	public boolean isMockNotificationEnabled() {
		return mockNotificationEnabled;
	}
}
