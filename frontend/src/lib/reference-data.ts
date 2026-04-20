/**
 * Backend /api/reference/* hazır olana kadar UI sabitlerini burada tutun.
 * Endpoint açıldığında: services/reference.ts + useQuery(queryKeys.reference.*) ile değiştirin.
 */

export const referenceUserRoles = ["CUSTOMER", "OWNER", "ADMIN"] as const;
export type ReferenceUserRole = (typeof referenceUserRoles)[number];

export const referenceReservationStatuses = ["PENDING", "CONFIRMED", "CANCELLED"] as const;
export type ReferenceReservationStatus = (typeof referenceReservationStatuses)[number];
