"use client";

import type { TokenPair } from "@/types/api/auth";

const ACCESS_TOKEN_KEY = "lezzetly.accessToken";
const REFRESH_TOKEN_KEY = "lezzetly.refreshToken";

export function readAccessToken(): string | null {
	if (typeof window === "undefined") {
		return null;
	}
	return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function readRefreshToken(): string | null {
	if (typeof window === "undefined") {
		return null;
	}
	return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

type StorableTokens = Pick<TokenPair, "accessToken" | "refreshToken">;

export function writeTokens(tokens: StorableTokens): void {
	if (typeof window === "undefined") {
		return;
	}
	window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
	window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearTokens(): void {
	if (typeof window === "undefined") {
		return;
	}
	window.localStorage.removeItem(ACCESS_TOKEN_KEY);
	window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}
