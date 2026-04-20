"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { fetchRestaurants } from "@/services/restaurants";

export function useRestaurants() {
	return useQuery({
		queryKey: queryKeys.restaurants.list(),
		queryFn: fetchRestaurants,
		staleTime: 5 * 60 * 1000,
	});
}
