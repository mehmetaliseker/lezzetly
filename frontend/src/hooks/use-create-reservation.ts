"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { createReservation, type CreateReservationPayload } from "@/services/reservations";

export function useCreateReservation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateReservationPayload) => createReservation(payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: queryKeys.reservations.all });
		},
	});
}
