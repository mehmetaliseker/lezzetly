"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { readAccessToken } from "@/lib/token-storage";
import { fetchMyReservations } from "@/services/reservations";

export function useMyReservations(limit: number = 100) {
	return useQuery({
		queryKey: queryKeys.reservations.mine(limit),
		queryFn: () => fetchMyReservations(limit),
		enabled: Boolean(readAccessToken()),
		retry: false,
	});
}
