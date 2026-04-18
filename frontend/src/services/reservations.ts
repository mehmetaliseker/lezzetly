import { getApiBaseUrl } from "@/lib/api-base";

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
	const response = await fetch(`${getApiBaseUrl()}/api/reservations`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const message = await readErrorMessage(response);
		throw new Error(message);
	}

	return response.json() as Promise<ReservationResponse>;
}

async function readErrorMessage(response: Response): Promise<string> {
	try {
		const body = (await response.json()) as { message?: string };
		return body.message ?? `Rezervasyon oluşturulamadı (${response.status})`;
	} catch {
		return `Rezervasyon oluşturulamadı (${response.status})`;
	}
}
