export enum UserRolePath {
	CUSTOMER = "/customer",
	OWNER = "/owner",
	ADMIN = "/admin",
}

export const userRolePathByApi = {
	CUSTOMER: UserRolePath.CUSTOMER,
	OWNER: UserRolePath.OWNER,
	ADMIN: UserRolePath.ADMIN,
} as const;

export type UserRoleApiValue = keyof typeof userRolePathByApi;

export function parseUserRolePath(apiRole: string): UserRolePath | null {
	if (Object.prototype.hasOwnProperty.call(userRolePathByApi, apiRole)) {
		return userRolePathByApi[apiRole as UserRoleApiValue];
	}
	return null;
}

export function userRoleApiFromPath(path: UserRolePath): UserRoleApiValue {
	switch (path) {
		case UserRolePath.CUSTOMER:
			return "CUSTOMER";
		case UserRolePath.OWNER:
			return "OWNER";
		case UserRolePath.ADMIN:
			return "ADMIN";
	}
}

export enum ReservationStatusPath {
	PENDING = "/pending",
	CONFIRMED = "/confirmed",
	CANCELLED = "/cancelled",
}

export const reservationStatusPathByApi = {
	PENDING: ReservationStatusPath.PENDING,
	CONFIRMED: ReservationStatusPath.CONFIRMED,
	CANCELLED: ReservationStatusPath.CANCELLED,
} as const;

export type ReservationStatusApiValue = keyof typeof reservationStatusPathByApi;

export function parseReservationStatusPath(apiStatus: string): ReservationStatusPath | null {
	if (Object.prototype.hasOwnProperty.call(reservationStatusPathByApi, apiStatus)) {
		return reservationStatusPathByApi[apiStatus as ReservationStatusApiValue];
	}
	return null;
}

export enum AppRoute {
	HOME = "/",
	LOGIN = "/login",
	REGISTER = "/register",
	RESTAURANTS = "/restaurants",
	RESERVATION = "/rezervasyon",
	MY_RESERVATIONS = "/rezervasyonlarim",
	PROFILE = "/profile",
	OWNER_PROFILE = "/owner/profile",
	OWNER_ACCOUNT = "/owner/account",
}

export enum AuthEndpoint {
	ROOT = "/api/auth",
	CUSTOMER_LOGIN = "/api/auth/customer/login",
	CUSTOMER_REGISTER = "/api/auth/customer/register",
	OWNER_LOGIN = "/api/auth/owner/login",
	OWNER_REGISTER = "/api/auth/owner/register",
	REFRESH = "/api/auth/refresh",
	LOGOUT = "/api/auth/logout",
	ME = "/api/auth/me",
	ME_PASSWORD = "/api/auth/me/password",
}

export enum RestaurantEndpoint {
	LIST = "/api/restaurants",
	DETAIL = "/api/restaurants/{id}",
	OWNER_PROFILE = "/api/restaurants/owner/profile",
	OWNER_PROFILE_IMAGES = "/api/restaurants/owner/profile/images",
	PUBLIC_IMAGE = "/api/restaurants/{restaurantId}/images/{segment}",
}

export enum ReservationEndpoint {
	CREATE = "/api/reservations",
	AVAILABILITY = "/api/reservations/availability/{restaurantId}",
	ME_PAST = "/api/reservations/me/past",
	ME_RECENT = "/api/reservations/me/recent",
	ME_LIST = "/api/reservations/me",
	CANCEL = "/api/reservations/{reservationId}/cancel",
}

export enum FeatureFlagEndpoint {
	LIST = "/api/feature-flags",
}
