import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type ErrorStateProps = {
	title?: string;
	message: string;
	action?: ReactNode;
	className?: string;
};

export function ErrorState({
	title = "Bir sorun oluştu",
	message,
	action,
	className,
}: ErrorStateProps) {
	return (
		<div
			className={cn(
				"rounded-xl border border-red-200/90 bg-red-50/90 px-5 py-6 text-center shadow-sm ring-1 ring-red-950/5",
				className
			)}
			role="alert"
		>
			<p className="text-sm font-semibold text-red-900">{title}</p>
			<p className="mt-2 text-sm leading-relaxed text-red-800/90">{message}</p>
			{action ? <div className="mt-4 flex justify-center">{action}</div> : null}
		</div>
	);
}
