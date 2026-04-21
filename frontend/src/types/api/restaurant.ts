/** Backend RestaurantResponse ile uyumlu (Swagger /api/restaurants). */
export type RestaurantResponse = {
	id: number;
	name: string;
	city: string;
	pricePerHour: number;
	active: boolean;
	tableCount: number;
	mainImageUrl: string | null;
	detailImageUrls: string[];
};
