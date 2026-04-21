package com.lezzetly.backend.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public final class JwtPrincipal implements UserDetails {

	private final AuthenticatedUser user;

	public JwtPrincipal(AuthenticatedUser user) {
		this.user = user;
	}

	public AuthenticatedUser user() {
		return user;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority("ROLE_" + user.role().name()));
	}

	@Override
	public String getPassword() {
		return "";
	}

	@Override
	public String getUsername() {
		return user.email();
	}
}
