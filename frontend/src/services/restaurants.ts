import { apiJson } from "@/lib/api-client";
import type { RestaurantResponse } from "@/types/api/restaurant";

export type { RestaurantResponse } from "@/types/api/restaurant";

export async function fetchRestaurants(): Promise<RestaurantResponse[]> {
	return apiJson<RestaurantResponse[]>("/api/restaurants");
}

export async function fetchRestaurantById(id: number): Promise<RestaurantResponse> {
	return apiJson<RestaurantResponse>(`/api/restaurants/${id}`);
}
