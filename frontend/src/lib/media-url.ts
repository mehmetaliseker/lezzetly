import { getApiBaseUrl } from "@/lib/api-base";

/** API göreli yolu veya tam URL'yi tarayıcıda kullanılabilir mutlak URL'ye çevirir. */
export function resolveApiMediaUrl(pathOrUrl: string | null | undefined): string {
	if (pathOrUrl == null || pathOrUrl.length === 0) {
		return "";
	}
	if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
		return pathOrUrl;
	}
	const base = getApiBaseUrl().replace(/\/$/, "");
	const suffix = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
	return `${base}${suffix}`;
}
