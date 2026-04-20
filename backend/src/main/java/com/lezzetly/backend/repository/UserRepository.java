package com.lezzetly.backend.repository;

import java.util.Optional;

import com.lezzetly.backend.domain.User;

public interface UserRepository {

	Optional<User> findActiveByEmail(String email);

	boolean existsByEmail(String email);

	User save(User user);
}
