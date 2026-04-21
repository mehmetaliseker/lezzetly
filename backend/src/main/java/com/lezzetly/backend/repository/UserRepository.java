package com.lezzetly.backend.repository;

import java.util.Optional;

import com.lezzetly.backend.domain.User;

public interface UserRepository {

	Optional<User> findActiveByEmail(String email);

	Optional<User> findById(Long id);

	boolean existsByEmail(String email);

	User save(User user);

	User updateProfile(Long userId, String firstName, String lastName, String email, String phone);

	void updatePasswordHash(Long userId, String passwordHash);
}
