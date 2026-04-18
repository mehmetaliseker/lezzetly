import { getApiBaseUrl } from "@/lib/api-base";

export type RestaurantResponse = {
	id: number;
	name: string;
	city: string;
	pricePerHour: number;
	active: boolean;
};

export async function fetchRestaurants(): Promise<RestaurantResponse[]> {
	const response = await fetch(`${getApiBaseUrl()}/api/restaurants`, {
		cache: "no-store",
	});

	if (!response.ok) {
		throw new Error("Restoranlar yüklenemedi");
	}

	return response.json() as Promise<RestaurantResponse[]>;
}
