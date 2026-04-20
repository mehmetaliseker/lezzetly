import { getApiBaseUrl } from "@/lib/api-base";

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
	const response = await fetch(buildUrl(path), {
		cache: "no-store",
		...init,
		headers: {
			Accept: "application/json",
			...init?.headers,
		},
	});

	if (!response.ok) {
		const message = await readErrorBody(response);
		throw new ApiError(message, response.status);
	}

	return response.json() as Promise<T>;
}

async function readErrorBody(response: Response): Promise<string> {
	try {
		const body = (await response.json()) as { message?: string };
		return body.message ?? `İstek başarısız (${response.status})`;
	} catch {
		return `İstek başarısız (${response.status})`;
	}
}
