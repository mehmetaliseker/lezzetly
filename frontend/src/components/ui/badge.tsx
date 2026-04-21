import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const variants = {
	default: "bg-zinc-100 text-zinc-800 ring-zinc-200/60",
	success: "bg-emerald-50 text-emerald-900 ring-emerald-200/70",
	warning: "bg-amber-50 text-amber-950 ring-amber-200/70",
	muted: "bg-zinc-50 text-zinc-600 ring-zinc-200/50",
} as const;

export type BadgeVariant = keyof typeof variants;

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
	variant?: BadgeVariant;
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
				variants[variant],
				className
			)}
			{...props}
		/>
	);
}
