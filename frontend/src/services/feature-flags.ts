import { apiJson } from "@/lib/api-client";
import { queryEndpoints } from "@/lib/query-endpoints";
import type { FeatureFlag } from "@/lib/feature-flags";

export async function fetchFeatureFlags(): Promise<FeatureFlag[]> {
	return apiJson<FeatureFlag[]>(queryEndpoints.featureFlags.list);
}
