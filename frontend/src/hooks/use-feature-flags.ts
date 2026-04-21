"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { fetchFeatureFlags } from "@/services/feature-flags";

export function useFeatureFlags() {
	return useQuery({
		queryKey: queryKeys.featureFlags.all,
		queryFn: fetchFeatureFlags,
		staleTime: 10 * 60 * 1000,
	});
}
