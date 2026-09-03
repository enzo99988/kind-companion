import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/jornal/Reveal";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "O que é o Jornal da Pátria?",
    answer:
      "É uma publicação digital que reúne notícias e contextos sobre os principais acontecimentos do Brasil, apresentados a partir de uma perspectiva editorial da direita brasileira.",
  },
  {
    question: "Com que frequência o conteúdo é atualizado?",
    answer:
      "O Jornal da Pátria acompanha os acontecimentos e recebe novos conteúdos regularmente. Não prometemos uma frequência fixa, mas trabalhamos para manter a experiência sempre atualizada.",
  },
  {
    question: "Por quanto tempo tenho acesso?",
    answer:
      "O acesso é válido pelo período contratado: 1 mês ou 3 meses, conforme a opção escolhida. A renovação não é automática nesta etapa.",
  },
  {
    question: "Posso acessar pelo celular?",
    answer:
      "Sim. A experiência foi pensada para funcionar em computadores, notebooks, tablets e celulares, com a mesma qualidade visual e legibilidade.",
  },
  {
    question: "Como funciona a garantia de 7 dias?",
    answer:
      "Você tem 7 dias para solicitar o cancelamento/reembolso, conforme as condições aplicáveis à compra. Basta entrar em contato pelo canal de suporte indicado no momento da compra.",
  },
  {
    question: "Como receberei acesso depois da compra?",
    answer:
      "Após a confirmação do pagamento, você receberá as instruções de acesso por e-mail. O sistema de criação automática de contas será implementado em breve.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-primary"
      >
        <span className="font-display text-lg tracking-tight text-foreground">
          {question}
        </span>
        <span
          className={cn(
            "grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border transition-transform duration-300",
            isOpen && "rotate-180 border-primary/60 text-primary",
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function OfferFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-y border-t border-border">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Dúvidas"
          title="PERGUNTAS FREQUENTES"
          align="center"
        />

        <Reveal delay={100} className="mt-12 surface-card rounded-lg p-6 sm:p-10">
          {FAQS.map((faq, index) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
