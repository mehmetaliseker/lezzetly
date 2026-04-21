import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

/** Select ve diğer native kontrollerde aynı görünüm için dışa açık sınıf. */
export const nativeFieldClassName =
	"w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm transition placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
	return <input className={cn(nativeFieldClassName, className)} {...props} />;
}
