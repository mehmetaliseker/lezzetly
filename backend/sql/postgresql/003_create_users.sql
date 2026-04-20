CREATE TABLE IF NOT EXISTS users (
	id BIGSERIAL PRIMARY KEY,
	first_name VARCHAR(80) NOT NULL,
	last_name VARCHAR(80) NOT NULL,
	email VARCHAR(255) NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	role VARCHAR(32) NOT NULL,
	active BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT users_email_unique UNIQUE (email),
	CONSTRAINT users_email_nonempty CHECK (char_length(trim(email)) > 0),
	CONSTRAINT users_names_nonempty CHECK (
		char_length(trim(first_name)) > 0 AND char_length(trim(last_name)) > 0
	),
	CONSTRAINT users_role_allowed CHECK (role IN ('CUSTOMER', 'OWNER', 'ADMIN')),
	CONSTRAINT users_password_hash_nonempty CHECK (char_length(trim(password_hash)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users (role) WHERE active = TRUE;

CREATE INDEX IF NOT EXISTS idx_users_active ON users (active);
