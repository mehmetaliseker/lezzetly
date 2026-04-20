import { cn } from "@/lib/cn";

type LoadingStateProps = {
	title?: string;
	message?: string;
	className?: string;
};

export function LoadingState({
	title = "Yükleniyor",
	message = "Lütfen bekleyin…",
	className,
}: LoadingStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-6 py-12 text-center",
				className
			)}
			role="status"
			aria-live="polite"
		>
			<div
				className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700"
				aria-hidden
			/>
			<div className="flex flex-col gap-1">
				<p className="text-sm font-medium text-zinc-800">{title}</p>
				<p className="text-sm text-zinc-500">{message}</p>
			</div>
		</div>
	);
}
