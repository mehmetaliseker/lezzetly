"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchFeatureFlags } from "@/services/feature-flags";

export function useFeatureFlags() {
	return useQuery({
		queryKey: ["feature-flags"],
		queryFn: fetchFeatureFlags,
		staleTime: 10 * 60 * 1000,
	});
}
