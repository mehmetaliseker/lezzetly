"use client";

import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { clearTokens, readAccessToken } from "@/lib/token-storage";
import { queryKeys } from "@/lib/query-keys";

export function AppProviders({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60_000,
						refetchOnWindowFocus: false,
					},
				},
			})
	);

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: "auto" });
	}, [pathname]);

	useEffect(() => {
		const intervalId = window.setInterval(() => {
			const accessToken = readAccessToken();
			if (!accessToken) {
				return;
			}
			if (isTokenExpired(accessToken)) {
				clearTokens();
				queryClient.setQueryData(queryKeys.auth.currentUser(), null);
			}
		}, 10_000);
		return () => window.clearInterval(intervalId);
	}, [queryClient]);

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

function isTokenExpired(token: string): boolean {
	try {
		const payloadPart = token.split(".")[1];
		if (!payloadPart) {
			return true;
		}
		const payloadJson = atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/"));
		const payload = JSON.parse(payloadJson) as { exp?: number };
		if (typeof payload.exp !== "number") {
			return true;
		}
		const currentEpoch = Math.floor(Date.now() / 1000);
		return payload.exp <= currentEpoch;
	} catch {
		return true;
	}
}
