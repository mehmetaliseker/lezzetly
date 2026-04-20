import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type PageHeaderProps = {
	title: string;
	description?: string;
	backHref?: string;
	backLabel?: string;
	children?: ReactNode;
	className?: string;
};

export function PageHeader({
	title,
	description,
	backHref,
	backLabel = "Geri",
	children,
	className,
}: PageHeaderProps) {
	return (
		<header className={cn("flex flex-col gap-4 border-b border-zinc-200/80 pb-8", className)}>
			{backHref ? (
				<Link
					className="inline-flex w-fit items-center gap-1 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
					href={backHref}
				>
					<span aria-hidden>←</span> {backLabel}
				</Link>
			) : null}
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">{title}</h1>
				{description ? (
					<p className="max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base">
						{description}
					</p>
				) : null}
			</div>
			{children}
		</header>
	);
}
