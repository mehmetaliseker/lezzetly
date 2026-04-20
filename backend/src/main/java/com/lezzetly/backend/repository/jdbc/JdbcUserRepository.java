package com.lezzetly.backend.repository.jdbc;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.lezzetly.backend.domain.User;
import com.lezzetly.backend.repository.UserRepository;

@Repository
public class JdbcUserRepository implements UserRepository {

	private static final String SELECT_COLUMNS = """
			SELECT id, first_name, last_name, email, password_hash, role, active, created_at, updated_at
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
			INSERT INTO users (first_name, last_name, email, password_hash, role, active)
			VALUES (?, ?, ?, ?, ?, ?)
			""";

	private static final String FIND_BY_ID = SELECT_COLUMNS + """
			WHERE id = ?
			LIMIT 1
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
	public boolean existsByEmail(String email) {
		Boolean exists = jdbcTemplate.queryForObject(EXISTS_BY_EMAIL, Boolean.class, email);
		return Boolean.TRUE.equals(exists);
	}

	@Override
	public User save(User user) {
		KeyHolder keyHolder = new GeneratedKeyHolder();
		int affected = jdbcTemplate.update(connection -> {
			PreparedStatement ps = connection.prepareStatement(INSERT, Statement.RETURN_GENERATED_KEYS);
			ps.setString(1, user.firstName());
			ps.setString(2, user.lastName());
			ps.setString(3, user.email());
			ps.setString(4, user.passwordHash());
			ps.setString(5, user.role().name());
			ps.setBoolean(6, user.active());
			return ps;
		}, keyHolder);

		if (affected == 0) {
			throw new IllegalStateException("Kullanıcı kaydedilemedi");
		}

		Number generatedId = keyHolder.getKey();
		if (generatedId == null) {
			throw new IllegalStateException("Kullanıcı kimliği üretilemedi");
		}

		return jdbcTemplate.query(FIND_BY_ID, userRowMapper, generatedId.longValue()).stream()
				.findFirst()
				.orElseThrow(() -> new IllegalStateException("Kaydedilen kullanıcı okunamadı"));
	}
}
