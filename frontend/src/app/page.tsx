import { HomeFeaturedRestaurants } from "@/features/home/components/home-featured-restaurants";
import { HomeFinalCta } from "@/features/home/components/home-final-cta";
import { HomeFooter } from "@/features/home/components/home-footer";
import { HomeHero } from "@/features/home/components/home-hero";
import { HomeHowItWorks } from "@/features/home/components/home-how-it-works";
import { HomeOverview } from "@/features/home/components/home-overview";
import { HomeTrust } from "@/features/home/components/home-trust";

export default function Home() {
	return (
		<main className="flex flex-col bg-brand-light">
			<HomeHero />
			<HomeOverview />
			<HomeFeaturedRestaurants />
			<HomeHowItWorks />
			<HomeTrust />
			<HomeFinalCta />
			<HomeFooter />
		</main>
	);
}
