import { ArrowLeft, ArrowRight } from "lucide-react";
import type { QuizQuestion } from "@/lib/quiz-data";
import { AnswerOption } from "./AnswerOption";
import { ImageContainer } from "./ImageContainer";

export function QuestionCard({
  question,
  number,
  total,
  selectedId,
  onSelect,
  onBack,
  onNext,
  canGoBack,
  isLast,
}: {
  question: QuizQuestion;
  number: number;
  total: number;
  selectedId?: string | undefined;
  onSelect: (optionId: string) => void;
  onBack: () => void;
  onNext: () => void;
  canGoBack: boolean;
  isLast: boolean;
}) {
  return (
    <article
      key={question.id}
      className="animate-fade-in rounded-lg surface-card p-5 sm:p-8 lg:p-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-display text-3xl text-primary sm:text-4xl">
            {String(number).padStart(2, "0")}
          </span>
          <span className="h-px w-8 gold-rule" />
          <span className="eyebrow text-muted-foreground">
            Pergunta {number} de {total}
          </span>
        </div>
        <span
          className={
            question.kind === "opinion"
              ? "rounded-full border border-accent/50 px-3 py-1 text-[0.6rem] font-semibold tracking-[0.18em] text-accent uppercase"
              : "rounded-full border border-primary/45 px-3 py-1 text-[0.6rem] font-semibold tracking-[0.18em] text-primary uppercase"
          }
        >
          {question.kind === "opinion" ? "Opinião" : question.theme}
        </span>
      </div>

      <div className="mt-6">
        <ImageContainer
          caption={question.imageCaption}
          src={question.image}
          size={question.imageSize}
        />
      </div>

      <h1 className="mt-7 font-display text-[clamp(1.4rem,4.6vw,2.15rem)] leading-[1.12] tracking-[-0.01em]">
        {question.prompt}
      </h1>
      {question.kind === "opinion" ? (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Esta é uma pergunta de percepção. Não existe resposta certa ou errada —
          sua escolha não altera sua pontuação.
        </p>
      ) : null}

      <div className="mt-7 grid gap-3">
        {question.options.map((option, i) => (
          <AnswerOption
            key={option.id}
            index={i}
            label={option.label}
            selected={selectedId === option.id}
            onSelect={() => onSelect(option.id)}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className="inline-flex items-center justify-center gap-2 rounded-sm border border-border px-6 py-4 text-[0.7rem] font-bold tracking-[0.16em] uppercase transition-colors hover:border-primary/60 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedId}
          className="group inline-flex items-center justify-center gap-3 rounded-sm bg-primary px-7 py-4 text-[0.7rem] font-bold tracking-[0.16em] text-primary-foreground uppercase transition-all hover:-translate-y-0.5 hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
          style={{ boxShadow: "var(--shadow-gold)" }}
        >
          {isLast ? "Concluir" : "Próxima pergunta"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      {!selectedId ? (
        <p className="mt-3 text-center text-[0.68rem] tracking-[0.12em] text-muted-foreground uppercase sm:text-right">
          Selecione uma opção para avançar
        </p>
      ) : null}
    </article>
  );
}
