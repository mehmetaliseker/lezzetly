/** Backend RestaurantResponse ile uyumlu (Swagger /api/restaurants). */
export type RestaurantResponse = {
	id: number;
	name: string;
	city: string;
	pricePerHour: number;
	active: boolean;
	tableCount: number;
	openingTime: string | null;
	closingTime: string | null;
	mainImageUrl: string | null;
	detailImageUrls: string[];
};
