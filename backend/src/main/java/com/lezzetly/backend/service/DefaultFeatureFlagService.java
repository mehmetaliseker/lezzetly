package com.lezzetly.backend.service;

import java.util.List;

import com.lezzetly.backend.dto.FeatureFlagResponse;

public class DefaultFeatureFlagService implements FeatureFlagService {

	private final boolean autoVerifyEmail;
	private final boolean mockNotificationEnabled;
	private final boolean profilePasswordVisibilityToggleEnabled;
	private final boolean profilePasswordChangeEnabled;

	public DefaultFeatureFlagService(
			boolean autoVerifyEmail,
			boolean mockNotificationEnabled,
			boolean profilePasswordVisibilityToggleEnabled,
			boolean profilePasswordChangeEnabled
	) {
		this.autoVerifyEmail = autoVerifyEmail;
		this.mockNotificationEnabled = mockNotificationEnabled;
		this.profilePasswordVisibilityToggleEnabled = profilePasswordVisibilityToggleEnabled;
		this.profilePasswordChangeEnabled = profilePasswordChangeEnabled;
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
				),
				new FeatureFlagResponse(
						"PROFILE_PASSWORD_CHANGE_ENABLED",
						profilePasswordChangeEnabled,
						"Müşteri ve işletmeci profilinde şifre güncelleme formunu açar"
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

	@Override
	public boolean isProfilePasswordChangeEnabled() {
		return profilePasswordChangeEnabled;
	}
}
