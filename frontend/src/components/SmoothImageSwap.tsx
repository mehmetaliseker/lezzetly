"use client";

import Image from "next/image";
import { motion } from "motion/react";

type SmoothImageSwapProps = {
	/** 0 = ilk görsel, 1 = ikinci görsel aktif */
	activeIndex: 0 | 1;
	images: readonly [string, string];
	alts: readonly [string, string];
	className?: string;
	/** LCP için ilk görselde priority */
	priorityFirst?: boolean;
};

/**
 * İki görsel aynı anda DOM’da kalır; biri kaldırılıp diğeri sonradan eklenmez.
 * Opacity + blur + hafif scale ile çapraz geçiş; boşluk oluşmaz.
 */
export default function SmoothImageSwap({
	activeIndex,
	images,
	alts,
	className,
	priorityFirst = true,
}: SmoothImageSwapProps) {
	return (
		<div className={className ?? "relative h-full w-full overflow-hidden"}>
			{images.map((src, index) => {
				const isActive = index === activeIndex;
				return (
					<motion.div
						className="absolute inset-0"
						initial={false}
						key={src}
						style={{
							pointerEvents: "none",
							willChange: "opacity, filter, transform",
							zIndex: isActive ? 2 : 1,
						}}
						animate={{
							opacity: isActive ? 1 : 0,
							filter: isActive
								? "blur(0px) brightness(1)"
								: "blur(12px) brightness(0.9)",
							scale: isActive ? 1 : 1.03,
						}}
						transition={{
							duration: 0.95,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						<Image
							alt={alts[index] ?? `Görsel ${index + 1}`}
							className="object-cover"
							fill
							priority={priorityFirst && index === 0}
							sizes="50vw"
							src={src}
						/>
					</motion.div>
				);
			})}
		</div>
	);
}
