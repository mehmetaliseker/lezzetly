/**
 * Backend /api/reference/* hazır olana kadar UI sabitlerini burada tutun.
 * Endpoint açıldığında: services/reference.ts + useQuery(queryKeys.reference.*) ile değiştirin.
 */

import type { ReservationStatusApiValue, UserRoleApiValue } from "@/types/enums";
import { reservationStatusPathByApi, userRolePathByApi } from "@/types/enums";

export const referenceUserRoles = Object.keys(userRolePathByApi) as readonly UserRoleApiValue[];
export type ReferenceUserRole = UserRoleApiValue;

export const referenceReservationStatuses = Object.keys(
	reservationStatusPathByApi
) as readonly ReservationStatusApiValue[];
export type ReferenceReservationStatus = ReservationStatusApiValue;
