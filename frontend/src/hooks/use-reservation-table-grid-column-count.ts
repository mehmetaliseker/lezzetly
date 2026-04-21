"use client";

import { useLayoutEffect, useState } from "react";

import { resolveReservationTableGridColumnCount } from "@/lib/reservation-table-grid";

export function useReservationTableGridColumnCount(): number {
	const [columns, setColumns] = useState(2);

	useLayoutEffect(() => {
		const update = (): void => {
			setColumns(resolveReservationTableGridColumnCount(window.innerWidth));
		};

		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);

	return columns;
}
