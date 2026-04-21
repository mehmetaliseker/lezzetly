package com.lezzetly.backend.repository.jdbc;

import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.lezzetly.backend.domain.User;
import com.lezzetly.backend.repository.UserRepository;

@Repository
public class JdbcUserRepository implements UserRepository {

	private static final String SELECT_COLUMNS = """
			SELECT id, first_name, last_name, email, phone, password_hash, role, active, created_at, updated_at
			FROM users
			""";

	private static final String FIND_ACTIVE_BY_EMAIL = SELECT_COLUMNS + """
			WHERE lower(email) = lower(?) AND active = TRUE
			LIMIT 1
			""";

	private static final String EXISTS_BY_EMAIL = """
			SELECT EXISTS(
				SELECT 1 FROM users WHERE lower(email) = lower(?)
			)
			""";

	private static final String INSERT = """
			INSERT INTO users (first_name, last_name, email, phone, password_hash, role, active)
			VALUES (?, ?, ?, ?, ?, ?, ?)
			RETURNING id
			""";

	private static final String FIND_BY_ID = SELECT_COLUMNS + """
			WHERE id = ?
			LIMIT 1
			""";

	private static final String UPDATE_PROFILE = """
			UPDATE users
			SET first_name = ?, last_name = ?, email = ?, phone = ?, updated_at = NOW()
			WHERE id = ?
			""";

	private static final String UPDATE_PASSWORD = """
			UPDATE users
			SET password_hash = ?, updated_at = NOW()
			WHERE id = ?
			""";

	private final JdbcTemplate jdbcTemplate;
	private final UserRowMapper userRowMapper;

	public JdbcUserRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
		this.userRowMapper = new UserRowMapper();
	}

	@Override
	public Optional<User> findActiveByEmail(String email) {
		List<User> rows = jdbcTemplate.query(FIND_ACTIVE_BY_EMAIL, userRowMapper, email);
		return rows.stream().findFirst();
	}

	@Override
	public Optional<User> findById(Long id) {
		List<User> rows = jdbcTemplate.query(FIND_BY_ID, userRowMapper, id);
		return rows.stream().findFirst();
	}

	@Override
	public boolean existsByEmail(String email) {
		Boolean exists = jdbcTemplate.queryForObject(EXISTS_BY_EMAIL, Boolean.class, email);
		return Boolean.TRUE.equals(exists);
	}

	@Override
	public User save(User user) {
		Long generatedId = jdbcTemplate.queryForObject(
				INSERT,
				Long.class,
				user.firstName(),
				user.lastName(),
				user.email(),
				user.phone(),
				user.passwordHash(),
				user.role().name(),
				user.active()
		);
		if (generatedId == null) {
			throw new IllegalStateException("Kullanıcı kimliği üretilemedi");
		}

		return new User(
				generatedId,
				user.firstName(),
				user.lastName(),
				user.email(),
				user.phone(),
				user.passwordHash(),
				user.role(),
				user.active(),
				null,
				null
		);
	}

	@Override
	public User updateProfile(Long userId, String firstName, String lastName, String email, String phone) {
		int affected = jdbcTemplate.update(UPDATE_PROFILE, firstName, lastName, email, phone, userId);
		if (affected == 0) {
			throw new IllegalStateException("Kullanıcı güncellenemedi");
		}
		return findById(userId).orElseThrow(() -> new IllegalStateException("Güncellenen kullanıcı bulunamadı"));
	}

	@Override
	public void updatePasswordHash(Long userId, String passwordHash) {
		int affected = jdbcTemplate.update(UPDATE_PASSWORD, passwordHash, userId);
		if (affected == 0) {
			throw new IllegalStateException("Kullanıcı şifresi güncellenemedi");
		}
	}
}
