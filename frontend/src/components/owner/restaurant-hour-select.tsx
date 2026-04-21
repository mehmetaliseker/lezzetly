"use client";

import { RESTAURANT_HOUR_OPTIONS, normalizeRestaurantHourToSelectValue } from "@/lib/restaurant-hours";

type RestaurantHourSelectProps = {
	name: string;
	label: string;
	defaultStoredTime: string | null | undefined;
	fallbackHour: number;
};

export function RestaurantHourSelect({ name, label, defaultStoredTime, fallbackHour }: RestaurantHourSelectProps) {
	const defaultValue = normalizeRestaurantHourToSelectValue(defaultStoredTime, fallbackHour);

	return (
		<label className="flex flex-col gap-2 text-sm text-stone-300">
			{label}
			<select
				className="rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
				defaultValue={defaultValue}
				name={name}
				required
			>
				{RESTAURANT_HOUR_OPTIONS.map((value) => {
					const hourLabel = value.slice(0, 2);
					return (
						<option key={value} value={value}>
							{hourLabel}
						</option>
					);
				})}
			</select>
		</label>
	);
}
