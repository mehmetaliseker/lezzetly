import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

const maxWidthClass = {
	narrow: "max-w-lg",
	medium: "max-w-2xl",
	wide: "max-w-4xl",
	xl: "max-w-6xl",
	/** Navbar ile aynı yatay hizalama (max-w-7xl + px) */
	site: "max-w-7xl",
} as const;

export type PageContainerWidth = keyof typeof maxWidthClass;

type PageContainerProps = {
	children: ReactNode;
	className?: string;
	maxWidth?: PageContainerWidth;
};

export function PageContainer({ children, className, maxWidth = "wide" }: PageContainerProps) {
	return (
		<div
			className={cn(
				"mx-auto w-full px-4 sm:px-6 lg:px-8",
				maxWidthClass[maxWidth],
				className
			)}
		>
			{children}
		</div>
	);
}
