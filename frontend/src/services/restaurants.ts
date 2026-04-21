import { apiFormData, apiJson } from "@/lib/api-client";
import { queryEndpoints } from "@/lib/query-endpoints";
import type { RestaurantResponse } from "@/types/api/restaurant";

export type { RestaurantResponse } from "@/types/api/restaurant";

export async function fetchRestaurants(): Promise<RestaurantResponse[]> {
	return apiJson<RestaurantResponse[]>(queryEndpoints.restaurants.list);
}

export async function fetchRestaurantById(id: number): Promise<RestaurantResponse> {
	return apiJson<RestaurantResponse>(queryEndpoints.restaurants.detail(id));
}

export type OwnerRestaurantProfileResponse = {
	restaurantId: number | null;
	name: string;
	city: string;
	description: string | null;
	address: string | null;
	phone: string | null;
	capacity: number | null;
	pricePerHour: number | null;
	openingTime: string | null;
	closingTime: string | null;
	mainImageUrl: string | null;
	detailImageUrls: string[];
	/** Müşteri listesinde görünür mü; kayıt yokken null. */
	active: boolean | null;
};

export type UpdateOwnerRestaurantProfilePayload = {
	name: string;
	city: string;
	description: string;
	address: string;
	phone: string;
	capacity: number;
	pricePerHour: number;
	openingTime: string;
	closingTime: string;
};

export async function fetchOwnerRestaurantProfile(): Promise<OwnerRestaurantProfileResponse> {
	return apiJson<OwnerRestaurantProfileResponse>(queryEndpoints.restaurants.ownerProfile);
}

export async function createOwnerRestaurantProfile(
	payload: UpdateOwnerRestaurantProfilePayload
): Promise<OwnerRestaurantProfileResponse> {
	return apiJson<OwnerRestaurantProfileResponse>(queryEndpoints.restaurants.ownerProfile, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
}

export async function updateOwnerRestaurantProfile(
	payload: UpdateOwnerRestaurantProfilePayload
): Promise<OwnerRestaurantProfileResponse> {
	return apiJson<OwnerRestaurantProfileResponse>(queryEndpoints.restaurants.ownerProfile, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
}

export async function uploadOwnerRestaurantImages(formData: FormData): Promise<void> {
	await apiFormData(queryEndpoints.restaurants.ownerProfileImages, formData);
}
