package com.lezzetly.backend.service;

import com.lezzetly.backend.dto.auth.AuthResponse;
import com.lezzetly.backend.dto.auth.CurrentUserResponse;
import com.lezzetly.backend.dto.auth.LoginRequest;
import com.lezzetly.backend.dto.auth.RefreshTokenResponse;
import com.lezzetly.backend.dto.auth.RegisterRequest;
import com.lezzetly.backend.dto.auth.UpdatePasswordRequest;
import com.lezzetly.backend.dto.auth.UpdateProfileRequest;

public interface AuthService {

	AuthResponse loginCustomer(LoginRequest request);

	AuthResponse registerCustomer(RegisterRequest request);

	AuthResponse loginOwner(LoginRequest request);

	AuthResponse registerOwner(RegisterRequest request);

	RefreshTokenResponse refresh(String refreshToken);

	void logout(String refreshToken);

	CurrentUserResponse currentUser(Long userId);

	CurrentUserResponse updateCurrentUser(Long userId, UpdateProfileRequest request);

	void updatePassword(Long userId, UpdatePasswordRequest request);
}
