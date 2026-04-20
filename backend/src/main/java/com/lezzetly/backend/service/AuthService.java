package com.lezzetly.backend.service;

import com.lezzetly.backend.dto.auth.AuthResponse;
import com.lezzetly.backend.dto.auth.LoginRequest;
import com.lezzetly.backend.dto.auth.RegisterRequest;

public interface AuthService {

	AuthResponse loginCustomer(LoginRequest request);

	AuthResponse registerCustomer(RegisterRequest request);

	AuthResponse loginOwner(LoginRequest request);

	AuthResponse registerOwner(RegisterRequest request);
}
