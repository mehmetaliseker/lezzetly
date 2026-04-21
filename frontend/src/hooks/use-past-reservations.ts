"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { readAccessToken } from "@/lib/token-storage";
import { fetchPastReservationsForRestaurant } from "@/services/reservations";

export function usePastReservations(restaurantId: number | null, limit: number = 5) {
	return useQuery({
		queryKey:
			restaurantId != null
				? queryKeys.reservations.pastForRestaurant(restaurantId, limit)
				: ["reservations", "past", "idle"],
		queryFn: () => fetchPastReservationsForRestaurant(restaurantId as number, limit),
		enabled: restaurantId != null && Number.isFinite(restaurantId) && Boolean(readAccessToken()),
		retry: false,
	});
}
