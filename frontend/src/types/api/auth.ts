export type AuthRole = "CUSTOMER" | "OWNER" | "ADMIN";

export type AuthUser = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	role: AuthRole;
};

export type AuthResponse = {
	message: string;
	user: AuthUser;
	tokens: TokenPair;
};

export type TokenPair = {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresInSeconds: number;
	refreshTokenExpiresInSeconds: number;
};

export type RefreshTokenResponse = {
	message: string;
	tokens: TokenPair;
};

export type CurrentUserResponse = AuthUser;

export type LoginPayload = {
	email: string;
	password: string;
};

export type RegisterPayload = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};
