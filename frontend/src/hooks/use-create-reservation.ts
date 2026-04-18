"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createReservation, type CreateReservationPayload } from "@/services/reservations";

export function useCreateReservation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateReservationPayload) => createReservation(payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["reservations"] });
		},
	});
}
