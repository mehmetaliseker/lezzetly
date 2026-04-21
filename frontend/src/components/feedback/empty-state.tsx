import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type EmptyStateProps = {
	title: string;
	description?: string;
	action?: ReactNode;
	className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/60 px-6 py-14 text-center",
				className
			)}
		>
			<p className="text-sm font-medium text-zinc-800">{title}</p>
			{description ? (
				<p className="max-w-md text-sm leading-relaxed text-zinc-600">{description}</p>
			) : null}
			{action ? <div className="mt-1">{action}</div> : null}
		</div>
	);
}
