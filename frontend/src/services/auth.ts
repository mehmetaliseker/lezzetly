import { apiJson } from "@/lib/api-client";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types/api/auth";

type AccountType = "customer" | "owner";

function resolveBase(accountType: AccountType): string {
	switch (accountType) {
		case "customer":
			return "/api/auth/customer";
		case "owner":
			return "/api/auth/owner";
		default:
			return "/api/auth/customer";
	}
}

export async function login(accountType: AccountType, payload: LoginPayload): Promise<AuthResponse> {
	return apiJson<AuthResponse>(`${resolveBase(accountType)}/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
}

export async function register(accountType: AccountType, payload: RegisterPayload): Promise<AuthResponse> {
	return apiJson<AuthResponse>(`${resolveBase(accountType)}/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
}
