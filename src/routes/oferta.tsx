import { createFileRoute } from "@tanstack/react-router";
import { OfferHeader } from "@/components/oferta/OfferHeader";
import { OfferHero } from "@/components/oferta/OfferHero";
import { OfferFeatures } from "@/components/oferta/OfferFeatures";
import { OfferUpdates } from "@/components/oferta/OfferUpdates";
import { OfferUrgency } from "@/components/oferta/OfferUrgency";
import { OfferPricing } from "@/components/oferta/OfferPricing";
import { OfferGuarantee } from "@/components/oferta/OfferGuarantee";
import { OfferFAQ } from "@/components/oferta/OfferFAQ";
import { OfferFinalCTA } from "@/components/oferta/OfferFinalCTA";
import { OfferFooter } from "@/components/oferta/OfferFooter";

export const Route = createFileRoute("/oferta")({
  head: () => ({
    meta: [
      { title: "Jornal da Pátria — Conheça a edição digital" },
      {
        name: "description",
        content:
          "Informação, contexto e acompanhamento dos principais acontecimentos do Brasil pela perspectiva editorial da direita brasileira.",
      },
      {
        property: "og:title",
        content: "Jornal da Pátria — Conheça a edição digital",
      },
      {
        property: "og:description",
        content:
          "Informação, contexto e visão sobre os acontecimentos que movimentam o Brasil pela perspectiva editorial da direita brasileira.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Oferta,
});

function Oferta() {
  return (
    <div className="min-h-screen bg-background">
      <OfferHeader />
      <main>
        <OfferHero />
        <OfferFeatures />
        <OfferUpdates />
        <OfferUrgency />
        <OfferPricing />
        <OfferGuarantee />
        <OfferFAQ />
        <OfferFinalCTA />
      </main>
      <OfferFooter />
    </div>
  );
}
