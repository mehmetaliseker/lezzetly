"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { fetchReservationAvailability } from "@/services/reservations";

export function useReservationAvailability(restaurantId: number | null, date: string | null) {
	return useQuery({
		queryKey:
			restaurantId != null && date != null
				? queryKeys.reservations.availability(restaurantId, date)
				: ["reservations", "availability", "idle"],
		queryFn: async () => fetchReservationAvailability(restaurantId as number, date as string),
		enabled: restaurantId != null && date != null,
	});
}
