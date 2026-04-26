package com.lezzetly.backend.service;

import java.util.List;

import com.lezzetly.backend.dto.FeatureFlagResponse;

public interface FeatureFlagService {

	List<FeatureFlagResponse> listPublicFlags();

	boolean isAutoVerifyEmailEnabled();

	boolean isMockNotificationEnabled();

	boolean isProfilePasswordVisibilityToggleEnabled();

	boolean isProfilePasswordChangeEnabled();
}
