"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { fetchRestaurantById } from "@/services/restaurants";

export function useRestaurant(id: number) {
	return useQuery({
		queryKey: queryKeys.restaurants.detail(id),
		queryFn: () => fetchRestaurantById(id),
		enabled: Number.isFinite(id) && id > 0,
		staleTime: 5 * 60 * 1000,
	});
}
