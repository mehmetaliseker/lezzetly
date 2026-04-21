"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { readAccessToken } from "@/lib/token-storage";
import { me } from "@/services/auth";
import { parseUserRolePath, UserRolePath } from "@/types/enums";

export type CurrentUser = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string | null;
	role: UserRolePath;
};

export function useCurrentUser() {
	return useQuery<CurrentUser | null>({
		queryKey: queryKeys.auth.currentUser(),
		queryFn: async () => {
			const raw = await me();
			return {
				...raw,
				role: parseUserRolePath(raw.role) ?? UserRolePath.CUSTOMER,
			};
		},
		enabled: Boolean(readAccessToken()),
		retry: false,
	});
}
