import { apiJson } from "@/lib/api-client";
import { queryEndpoints } from "@/lib/query-endpoints";

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

export type CustomerReservationCardResponse = {
	id: number;
	restaurantId: number;
	restaurantName: string;
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
	return apiJson<ReservationResponse>(queryEndpoints.reservations.create, {
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
		`${queryEndpoints.reservations.availability(restaurantId)}?date=${encodeURIComponent(date)}`
	);
}

export async function fetchPastReservationsForRestaurant(
	restaurantId: number,
	limit: number = 5
): Promise<ReservationResponse[]> {
	return apiJson<ReservationResponse[]>(
		`${queryEndpoints.reservations.mePast}?restaurantId=${restaurantId}&limit=${limit}`
	);
}

export async function fetchRecentReservationsForRestaurant(
	restaurantId: number,
	limit: number = 5
): Promise<ReservationResponse[]> {
	return apiJson<ReservationResponse[]>(
		`${queryEndpoints.reservations.meRecent}?restaurantId=${restaurantId}&limit=${limit}`
	);
}

export async function fetchMyReservations(limit: number = 100): Promise<CustomerReservationCardResponse[]> {
	return apiJson<CustomerReservationCardResponse[]>(`${queryEndpoints.reservations.meList}?limit=${limit}`);
}

export async function cancelMyReservation(reservationId: number): Promise<void> {
	await apiJson<void>(queryEndpoints.reservations.cancel(reservationId), {
		method: "POST",
	});
}
