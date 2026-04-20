"use client";

import { useMutation } from "@tanstack/react-query";

import { login, register } from "@/services/auth";
import type { LoginPayload, RegisterPayload } from "@/types/api/auth";

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
	return useMutation({
		mutationFn: ({ accountType, payload }: LoginInput) => login(accountType, payload),
	});
}

export function useRegisterMutation() {
	return useMutation({
		mutationFn: ({ accountType, payload }: RegisterInput) => register(accountType, payload),
	});
}
