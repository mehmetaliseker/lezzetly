"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clearTokens, readRefreshToken } from "@/lib/token-storage";
import { queryKeys } from "@/lib/query-keys";
import { logout } from "@/services/auth";

export function useLogoutMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			const refreshToken = readRefreshToken();
			if (refreshToken) {
				await logout(refreshToken);
			}
		},
		onSettled: () => {
			clearTokens();
			queryClient.setQueryData(queryKeys.auth.currentUser(), null);
		},
	});
}
