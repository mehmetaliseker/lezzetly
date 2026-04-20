import { apiJson } from "@/lib/api-client";

export type CreateReservationPayload = {
	restaurantId: number;
	date: string;
	startTime: string;
	endTime: string;
};

export type ReservationResponse = {
	id: number;
	restaurantId: number;
	date: string;
	startTime: string;
	endTime: string;
	durationMinutes: number;
	totalPrice: number;
	status: string;
};

export async function createReservation(
	payload: CreateReservationPayload
): Promise<ReservationResponse> {
	return apiJson<ReservationResponse>("/api/reservations", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
}
