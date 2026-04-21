import { queryEndpoints } from "@/lib/query-endpoints";

const restaurantsRoot = ["restaurants"] as const;

const referenceRoot = ["reference"] as const;

const ownerRoot = ["owner"] as const;

export const queryKeys = {
	restaurants: {
		all: restaurantsRoot,
		list: () => [...restaurantsRoot, queryEndpoints.restaurants.list] as const,
		detail: (id: number) => [...restaurantsRoot, queryEndpoints.restaurants.detail(id)] as const,
	},
	owner: {
		root: ownerRoot,
		restaurantProfile: () => [...ownerRoot, queryEndpoints.restaurants.ownerProfile] as const,
	},
	featureFlags: {
		all: [queryEndpoints.featureFlags.list] as const,
	},
	auth: {
		currentUser: () => ["auth", queryEndpoints.auth.me] as const,
		session: () => ["auth", "session"] as const,
	},
	reservations: {
		all: ["reservations"] as const,
		availability: (restaurantId: number, date: string) =>
			["reservations", queryEndpoints.reservations.availability(restaurantId), date] as const,
		pastForRestaurant: (restaurantId: number, limit: number) =>
			["reservations", "past", restaurantId, limit] as const,
	},
	reference: {
		root: referenceRoot,
		roles: () => [...referenceRoot, "roles"] as const,
		reservationStatuses: () => [...referenceRoot, "reservation-statuses"] as const,
		restaurantCategories: () => [...referenceRoot, "restaurant-categories"] as const,
	},
} as const;
