package com.lezzetly.backend.service;

import java.util.List;

import com.lezzetly.backend.dto.FeatureFlagResponse;

public class DefaultFeatureFlagService implements FeatureFlagService {

	private final boolean autoVerifyEmail;
	private final boolean mockNotificationEnabled;
	private final boolean profilePasswordVisibilityToggleEnabled;

	public DefaultFeatureFlagService(
			boolean autoVerifyEmail,
			boolean mockNotificationEnabled,
			boolean profilePasswordVisibilityToggleEnabled
	) {
		this.autoVerifyEmail = autoVerifyEmail;
		this.mockNotificationEnabled = mockNotificationEnabled;
		this.profilePasswordVisibilityToggleEnabled = profilePasswordVisibilityToggleEnabled;
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
				),
				new FeatureFlagResponse(
						"PROFILE_PASSWORD_VISIBILITY_TOGGLE",
						profilePasswordVisibilityToggleEnabled,
						"Profil şifre alanlarında göster/gizle düğmesi"
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

	@Override
	public boolean isProfilePasswordVisibilityToggleEnabled() {
		return profilePasswordVisibilityToggleEnabled;
	}
}
