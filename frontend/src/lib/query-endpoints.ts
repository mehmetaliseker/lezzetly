import {
	AuthEndpoint,
	FeatureFlagEndpoint,
	ReservationEndpoint,
	RestaurantEndpoint,
} from "@/types/enums";

export const queryEndpoints = {
	auth: {
		root: AuthEndpoint.ROOT,
		customerLogin: AuthEndpoint.CUSTOMER_LOGIN,
		customerRegister: AuthEndpoint.CUSTOMER_REGISTER,
		ownerLogin: AuthEndpoint.OWNER_LOGIN,
		ownerRegister: AuthEndpoint.OWNER_REGISTER,
		refresh: AuthEndpoint.REFRESH,
		logout: AuthEndpoint.LOGOUT,
		me: AuthEndpoint.ME,
		mePassword: AuthEndpoint.ME_PASSWORD,
	},
	restaurants: {
		list: RestaurantEndpoint.LIST,
		detail: (id: number) => RestaurantEndpoint.DETAIL.replace("{id}", id.toString()),
		ownerProfile: RestaurantEndpoint.OWNER_PROFILE,
		ownerProfileImages: RestaurantEndpoint.OWNER_PROFILE_IMAGES,
		publicImage: (restaurantId: number, segment: "main" | "detail1" | "detail2") =>
			RestaurantEndpoint.PUBLIC_IMAGE.replace("{restaurantId}", restaurantId.toString()).replace(
				"{segment}",
				segment
			),
	},
	reservations: {
		create: ReservationEndpoint.CREATE,
		availability: (restaurantId: number) =>
			ReservationEndpoint.AVAILABILITY.replace("{restaurantId}", restaurantId.toString()),
		mePast: ReservationEndpoint.ME_PAST,
	},
	featureFlags: {
		list: FeatureFlagEndpoint.LIST,
	},
} as const;