"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";

/** Backend oturum sözleşmesi netleşince doldurulacak (ör. GET /api/auth/me). */
export type CurrentUser = {
	id: number;
	email: string;
	role: string;
};

/**
 * Auth endpoint hazır olana kadar `enabled: false` — ağ çağrısı yok, mock yok.
 * Giriş sonrası: queryClient.setQueryData veya enabled + gerçek fetch ekleyin.
 */
export function useCurrentUser() {
	return useQuery<CurrentUser | null>({
		queryKey: queryKeys.auth.currentUser(),
		queryFn: async () => {
			throw new Error("Auth endpoint henüz tanımlı değil");
		},
		enabled: false,
	});
}
