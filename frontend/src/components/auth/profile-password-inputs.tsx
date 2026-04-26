"use client";

import { useId, useState } from "react";

type ProfilePasswordInputsProps = {
	visibilityToggleEnabled: boolean;
	currentPassword: string;
	newPassword: string;
	onCurrentPasswordChange: (value: string) => void;
	onNewPasswordChange: (value: string) => void;
};

export function ProfilePasswordInputs({
	visibilityToggleEnabled,
	currentPassword,
	newPassword,
	onCurrentPasswordChange,
	onNewPasswordChange,
}: ProfilePasswordInputsProps) {
	const baseId = useId();
	const currentId = `${baseId}-current`;
	const newId = `${baseId}-new`;
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNew, setShowNew] = useState(false);

	const currentType = visibilityToggleEnabled && showCurrent ? "text" : "password";
	const newType = visibilityToggleEnabled && showNew ? "text" : "password";

	const inputClass =
		"w-full rounded-md border border-stone-700 bg-stone-950 px-3 py-2 pr-11 text-stone-100 outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40";

	return (
		<>
			<div className="flex flex-col gap-2 text-sm text-stone-300">
				<label className="flex flex-col gap-2" htmlFor={currentId}>
					Mevcut şifre
				</label>
				<div className="relative">
					<input
						className={inputClass}
						id={currentId}
						name="currentPassword"
						type={currentType}
						autoComplete="current-password"
						value={currentPassword}
						onChange={(event) => onCurrentPasswordChange(event.target.value)}
					/>
					{visibilityToggleEnabled ? (
						<button
							type="button"
							className="absolute right-1 top-1/2 inline-flex min-h-9 min-w-9 -translate-y-1/2 items-center justify-center rounded-md text-xs font-medium text-stone-300 transition hover:bg-stone-800 hover:text-stone-100"
							onClick={() => setShowCurrent((value) => !value)}
							aria-pressed={showCurrent}
							aria-label={showCurrent ? "Mevcut şifreyi gizle" : "Mevcut şifreyi göster"}
						>
							{showCurrent ? "Gizle" : "Göster"}
						</button>
					) : null}
				</div>
			</div>
			<div className="flex flex-col gap-2 text-sm text-stone-300">
				<label className="flex flex-col gap-2" htmlFor={newId}>
					Yeni şifre
				</label>
				<div className="relative">
					<input
						className={inputClass}
						id={newId}
						name="newPassword"
						type={newType}
						autoComplete="new-password"
						value={newPassword}
						onChange={(event) => onNewPasswordChange(event.target.value)}
					/>
					{visibilityToggleEnabled ? (
						<button
							type="button"
							className="absolute right-1 top-1/2 inline-flex min-h-9 min-w-9 -translate-y-1/2 items-center justify-center rounded-md text-xs font-medium text-stone-300 transition hover:bg-stone-800 hover:text-stone-100"
							onClick={() => setShowNew((value) => !value)}
							aria-pressed={showNew}
							aria-label={showNew ? "Yeni şifreyi gizle" : "Yeni şifreyi göster"}
						>
							{showNew ? "Gizle" : "Göster"}
						</button>
					) : null}
				</div>
			</div>
		</>
	);
}
