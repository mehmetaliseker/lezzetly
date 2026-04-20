import { apiJson } from "@/lib/api-client";
import type { FeatureFlag } from "@/lib/feature-flags";

export async function fetchFeatureFlags(): Promise<FeatureFlag[]> {
	return apiJson<FeatureFlag[]>("/api/feature-flags");
}
