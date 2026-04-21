import { apiJson } from "@/lib/api-client";

export type CreateReservationPayload = {
	restaurantId: number;
	date: string;
	tableNo: number;
	selectedHours: number[];
};

export type ReservationResponse = {
	id: number;
	userId: number;
	restaurantId: number;
	tableNo: number;
	date: string;
	selectedHours: number[];
	slotCount: number;
	totalPrice: number;
	status: string;
};

export type ReservationAvailabilityResponse = {
	restaurantId: number;
	date: string;
	tables: {
		tableNo: number;
		disabledHours: number[];
	}[];
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

export async function fetchReservationAvailability(
	restaurantId: number,
	date: string
): Promise<ReservationAvailabilityResponse> {
	return apiJson<ReservationAvailabilityResponse>(
		`/api/reservations/availability/${restaurantId}?date=${date}`
	);
}
