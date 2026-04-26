import { getApiBaseUrl } from "@/lib/api-base";
import { clearTokens, readAccessToken, readRefreshToken, writeTokens } from "@/lib/token-storage";

export class ApiError extends Error {
	public readonly status: number;

	public constructor(message: string, status: number) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

function buildUrl(path: string): string {
	const base = getApiBaseUrl().replace(/\/$/, "");
	const suffix = path.startsWith("/") ? path : `/${path}`;
	return `${base}${suffix}`;
}

export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await sendWithAuth(path, init);

	if (!response.ok) {
		const message = await readErrorBody(response);
		throw new ApiError(message, response.status);
	}

	if (response.status === 204) {
		return undefined as T;
	}
	return response.json() as Promise<T>;
}

let refreshPromise: Promise<void> | null = null;

async function sendWithAuth(path: string, init?: RequestInit): Promise<Response> {
	const includeAccessToken = shouldAttachAccessToken(path);
	const firstResponse = await fetch(buildUrl(path), buildRequestInit(init, includeAccessToken));
	if (firstResponse.status !== 401) {
		return firstResponse;
	}
	const refreshToken = readRefreshToken();
	if (!refreshToken) {
		return firstResponse;
	}
	if (!canAutoRefresh(path)) {
		return firstResponse;
	}
	if (!refreshPromise) {
		refreshPromise = fetch(buildUrl("/api/auth/refresh"), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ refreshToken }),
		})
			.then(async (response) => {
				if (!response.ok) {
					throw new Error("Refresh başarısız");
				}
				type RefreshPayload = {
					tokens: { accessToken: string; refreshToken: string };
				};
				const payload = (await response.json()) as RefreshPayload;
				return payload;
			})
			.then((result) => {
				writeTokens(result.tokens);
			})
			.catch(() => {
				clearTokens();
			})
			.finally(() => {
				refreshPromise = null;
			});
	}
	await refreshPromise;
	return fetch(buildUrl(path), buildRequestInit(init, includeAccessToken));
}

function shouldAttachAccessToken(path: string): boolean {
	if (path === "/api/auth/me" || path === "/api/auth/me/password" || path === "/api/auth/logout") {
		return true;
	}
	return !path.startsWith("/api/auth/");
}

function canAutoRefresh(path: string): boolean {
	return (
		path === "/api/auth/me" ||
		path === "/api/auth/me/password" ||
		path === "/api/auth/logout" ||
		!path.startsWith("/api/auth/")
	);
}

function buildRequestInit(init: RequestInit | undefined, includeAccessToken: boolean): RequestInit {
	const headers = new Headers(init?.headers);
	const body = init?.body;
	if (!(body instanceof FormData)) {
		headers.set("Accept", "application/json");
	}
	if (includeAccessToken) {
		const accessToken = readAccessToken();
		if (accessToken) {
			headers.set("Authorization", `Bearer ${accessToken}`);
		}
	}
	return {
		cache: "no-store",
		...init,
		headers,
	};
}

export async function apiFormData(path: string, formData: FormData): Promise<void> {
	const response = await sendWithAuth(path, {
		method: "POST",
		body: formData,
	});
	if (!response.ok) {
		const message = await readErrorBody(response);
		throw new ApiError(message, response.status);
	}
}

async function readErrorBody(response: Response): Promise<string> {
	if (response.status === 401 || response.status === 403) {
		return "Oturum gerekli";
	}
	try {
		const body = (await response.json()) as { message?: string };
		return body.message ?? `İstek başarısız (${response.status})`;
	} catch {
		return `İstek başarısız (${response.status})`;
	}
}
