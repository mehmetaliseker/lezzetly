"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

export type NavbarVariant = "primary" | "secondary" | "tertiary";

const AUTH_PATHS = ["/login", "/register"] as const;

function isAuthPath(pathname: string): boolean {
	for (const authPath of AUTH_PATHS) {
		if (pathname === authPath || pathname.startsWith(`${authPath}/`)) {
			return true;
		}
	}
	return false;
}

export function useNavbarVariant(): NavbarVariant {
	const pathname = usePathname();

	return useMemo(() => {
		if (pathname === "/") {
			return "primary";
		}
		if (isAuthPath(pathname)) {
			return "secondary";
		}
		return "tertiary";
	}, [pathname]);
}
