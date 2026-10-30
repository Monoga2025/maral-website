import { BandFinder } from "@/components/home/BandFinder";
import { HomeHero } from "@/components/home/HomeHero";
import { BrandsStrip, CtaBand, HowToBuy, LinesBento, MadeBand, StationsRail } from "@/components/home/HomeSections";
import { RevealController } from "@/components/home/RevealController";
import { StatBand } from "@/components/home/StatBand";

export default function Home() {
  return <main className="maral-home">
    <HomeHero />
    <StatBand />
    <BandFinder />
    <LinesBento />
    <StationsRail />
    <MadeBand />
    <HowToBuy />
    <BrandsStrip />
    <CtaBand />
    <RevealController />
  </main>;
}
