"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchReservationAvailability } from "@/services/reservations";

export function useReservationAvailability(restaurantId: number | null, date: string | null) {
	return useQuery({
		queryKey: ["reservations", "availability", restaurantId, date],
		queryFn: async () => fetchReservationAvailability(restaurantId as number, date as string),
		enabled: restaurantId != null && date != null,
	});
}
