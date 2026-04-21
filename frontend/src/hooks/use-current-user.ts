"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { readAccessToken } from "@/lib/token-storage";
import { me } from "@/services/auth";

export type CurrentUser = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
};

export function useCurrentUser() {
	return useQuery<CurrentUser | null>({
		queryKey: queryKeys.auth.currentUser(),
		queryFn: async () => me(),
		enabled: Boolean(readAccessToken()),
		retry: false,
	});
}
