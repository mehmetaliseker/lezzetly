import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ReservationResponse } from "@/services/reservations";

type ReservationSummaryProps = {
	data: ReservationResponse;
};

export function ReservationSummary({ data }: ReservationSummaryProps) {
	return (
		<Card className="border-emerald-200/90 bg-emerald-50/40 ring-emerald-950/5">
			<CardHeader className="border-emerald-100">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<p className="text-sm font-semibold text-emerald-950">Rezervasyon oluşturuldu</p>
					<Badge variant="success">{data.status}</Badge>
				</div>
			</CardHeader>
			<CardContent className="grid gap-3 sm:grid-cols-2">
				<SummaryRow label="Rezervasyon no" value={String(data.id)} />
				<SummaryRow label="Restoran" value={`#${data.restaurantId}`} />
				<SummaryRow label="Tarih" value={data.date} />
				<SummaryRow label="Saat" value={`${data.startTime} – ${data.endTime}`} />
				<SummaryRow label="Süre" value={`${data.durationMinutes} dk`} />
				<SummaryRow label="Toplam" value={String(data.totalPrice)} highlight />
			</CardContent>
		</Card>
	);
}

function SummaryRow({
	label,
	value,
	highlight,
}: {
	label: string;
	value: string;
	highlight?: boolean;
}) {
	return (
		<div className="flex flex-col gap-0.5 rounded-lg bg-white/60 px-3 py-2 ring-1 ring-emerald-100/80">
			<span className="text-xs font-medium uppercase tracking-wide text-emerald-800/80">{label}</span>
			<span
				className={
					highlight
						? "text-base font-semibold text-emerald-950"
						: "text-sm font-medium text-emerald-950"
				}
			>
				{value}
			</span>
		</div>
	);
}
