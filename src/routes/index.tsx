import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/jornal/Header";
import { Hero } from "@/components/jornal/Hero";
import { AboutSection } from "@/components/jornal/AboutSection";
import { FiguresCarousel } from "@/components/jornal/FiguresCarousel";
import { NewspaperPreview } from "@/components/jornal/NewspaperPreview";
import { QuizPreview } from "@/components/jornal/QuizPreview";
import { Testimonials } from "@/components/jornal/Testimonials";
import { FinalCTA } from "@/components/jornal/FinalCTA";
import { Footer } from "@/components/jornal/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jornal da Pátria — Informação e contexto sobre o Brasil" },
      {
        name: "description",
        content:
          "Notícias, análises e contextos sobre os principais acontecimentos do Brasil, em uma experiência digital editorial premium.",
      },
      { property: "og:title", content: "Jornal da Pátria — Informação e contexto sobre o Brasil" },
      {
        property: "og:description",
        content:
          "Notícias, análises e contextos sobre os acontecimentos que movimentam o Brasil.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <AboutSection />
        <FiguresCarousel />
        <NewspaperPreview />
        <QuizPreview />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
