"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { readAccessToken } from "@/lib/token-storage";
import { fetchRecentReservationsForRestaurant } from "@/services/reservations";

export function useRecentReservationsForRestaurant(restaurantId: number | null, limit: number = 5) {
	return useQuery({
		queryKey:
			restaurantId != null
				? queryKeys.reservations.recentForRestaurant(restaurantId, limit)
				: ["reservations", "recent", "idle"],
		queryFn: () => fetchRecentReservationsForRestaurant(restaurantId as number, limit),
		enabled: restaurantId != null && Number.isFinite(restaurantId) && Boolean(readAccessToken()),
		retry: false,
	});
}
