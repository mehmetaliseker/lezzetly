import { getApiBaseUrl } from "@/lib/api-base";
import type { FeatureFlag } from "@/lib/feature-flags";

export async function fetchFeatureFlags(): Promise<FeatureFlag[]> {
	const response = await fetch(`${getApiBaseUrl()}/api/feature-flags`, {
		cache: "no-store",
	});

	if (!response.ok) {
		throw new Error("Özellik bayrakları yüklenemedi");
	}

	return response.json() as Promise<FeatureFlag[]>;
}
