import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionTitleProps = {
	title: string;
	description?: string;
	action?: ReactNode;
	className?: string;
};

export function SectionTitle({ title, description, action, className }: SectionTitleProps) {
	return (
		<div className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
			<div className="flex min-w-0 flex-col gap-1">
				<h2 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">{title}</h2>
				{description ? (
					<p className="max-w-2xl text-sm leading-relaxed text-zinc-600">{description}</p>
				) : null}
			</div>
			{action ? <div className="shrink-0">{action}</div> : null}
		</div>
	);
}
