import { apiJson } from "@/lib/api-client";
import { queryEndpoints } from "@/lib/query-endpoints";
import type {
	AuthResponse,
	CurrentUserResponse,
	LoginPayload,
	RefreshTokenResponse,
	RegisterPayload,
	UpdateProfilePayload,
} from "@/types/api/auth";

type AccountType = "customer" | "owner";

function resolveRegisterLoginPath(accountType: AccountType, action: "login" | "register"): string {
	switch (accountType) {
		case "customer":
			return action === "login" ? queryEndpoints.auth.customerLogin : queryEndpoints.auth.customerRegister;
		case "owner":
			return action === "login" ? queryEndpoints.auth.ownerLogin : queryEndpoints.auth.ownerRegister;
		default:
			return queryEndpoints.auth.customerLogin;
	}
}

export async function login(accountType: AccountType, payload: LoginPayload): Promise<AuthResponse> {
	return apiJson<AuthResponse>(resolveRegisterLoginPath(accountType, "login"), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
}

export async function register(accountType: AccountType, payload: RegisterPayload): Promise<AuthResponse> {
	return apiJson<AuthResponse>(resolveRegisterLoginPath(accountType, "register"), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
}

export async function refresh(refreshToken: string): Promise<RefreshTokenResponse> {
	return apiJson<RefreshTokenResponse>(queryEndpoints.auth.refresh, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ refreshToken }),
	});
}

export async function logout(refreshToken: string): Promise<void> {
	await apiJson<void>(queryEndpoints.auth.logout, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ refreshToken }),
	});
}

export async function me(): Promise<CurrentUserResponse> {
	return apiJson<CurrentUserResponse>(queryEndpoints.auth.me);
}

export async function updateMe(payload: UpdateProfilePayload): Promise<CurrentUserResponse> {
	return apiJson<CurrentUserResponse>(queryEndpoints.auth.me, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
}

export async function updatePassword(payload: { currentPassword: string; newPassword: string }): Promise<void> {
	await apiJson<void>(queryEndpoints.auth.mePassword, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
}
