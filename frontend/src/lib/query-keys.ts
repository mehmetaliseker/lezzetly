/**
 * TanStack Query anahtarları — feature bazlı gruplanır, invalidasyon buradan yapılır.
 * Gelecek reference endpoint’leri için anahtarlar hazır; fetch henüz bağlanmayabilir.
 */

const restaurantsRoot = ["restaurants"] as const;

const referenceRoot = ["reference"] as const;

export const queryKeys = {
	restaurants: {
		all: restaurantsRoot,
		list: () => [...restaurantsRoot, "list"] as const,
		detail: (id: number) => [...restaurantsRoot, "detail", id] as const,
	},
	featureFlags: {
		all: ["feature-flags"] as const,
	},
	auth: {
		currentUser: () => ["auth", "current-user"] as const,
	},
	reservations: {
		all: ["reservations"] as const,
	},
	reference: {
		root: referenceRoot,
		roles: () => [...referenceRoot, "roles"] as const,
		reservationStatuses: () => [...referenceRoot, "reservation-statuses"] as const,
		restaurantCategories: () => [...referenceRoot, "restaurant-categories"] as const,
	},
} as const;
