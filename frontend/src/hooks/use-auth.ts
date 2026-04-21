"use client";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { login, register } from "@/services/auth";
import type { LoginPayload, RegisterPayload } from "@/types/api/auth";
import { writeTokens } from "@/lib/token-storage";
import { queryKeys } from "@/lib/query-keys";

type AccountType = "customer" | "owner";

type LoginInput = {
	accountType: AccountType;
	payload: LoginPayload;
};

type RegisterInput = {
	accountType: AccountType;
	payload: RegisterPayload;
};

export function useLoginMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ accountType, payload }: LoginInput) => login(accountType, payload),
		onSuccess: (data) => {
			writeTokens(data.tokens);
			queryClient.setQueryData(queryKeys.auth.currentUser(), data.user);
		},
	});
}

export function useRegisterMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ accountType, payload }: RegisterInput) => register(accountType, payload),
		onSuccess: (data) => {
			writeTokens(data.tokens);
			queryClient.setQueryData(queryKeys.auth.currentUser(), data.user);
		},
	});
}
