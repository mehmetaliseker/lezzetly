import type { UserRoleApiValue } from "@/types/enums";

export type AuthRole = UserRoleApiValue;

export type AuthUser = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string | null;
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

export type UpdateProfilePayload = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
};

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
