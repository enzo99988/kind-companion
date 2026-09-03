import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Landmark, Target, Vote } from "lucide-react";
import { QUIZ_QUESTIONS, BALLOT_AFTER_INDEX } from "@/lib/quiz-data";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { ElectronicBallotSimulation } from "@/components/quiz/ElectronicBallotSimulation";
import { QuizResult } from "@/components/quiz/QuizResult";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz da Pátria — Teste seus conhecimentos sobre o Brasil" },
      {
        name: "description",
        content:
          "Um quiz interativo com 16 perguntas sobre história, política, instituições e símbolos do Brasil, com simulação educativa de urna.",
      },
      { property: "og:title", content: "Quiz da Pátria — Jornal da Pátria" },
      {
        property: "og:description",
        content:
          "Perguntas sobre história, política e instituições brasileiras, em uma experiência editorial premium.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizPage,
});

type Step =
  | { type: "question"; index: number }
  | { type: "ballot" };

const STEPS: Step[] = QUIZ_QUESTIONS.flatMap((_, index) =>
  index === BALLOT_AFTER_INDEX
    ? ([{ type: "question", index }, { type: "ballot" }] as Step[])
    : ([{ type: "question", index }] as Step[]),
);

const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length;

function QuizPage() {
  const [phase, setPhase] = useState<"intro" | "running" | "done" | "result">(
    "intro",
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [ballotCode, setBallotCode] = useState<string | undefined>(undefined);

  const reset = () => {
    setAnswers({});
    setBallotCode(undefined);
    setStepIndex(0);
    setPhase("intro");
  };

  if (phase === "intro") return <QuizIntro onStart={() => setPhase("running")} />;

  if (phase === "result")
    return (
      <QuizResult answers={answers} ballotCode={ballotCode} onRestart={reset} />
    );

  const step = STEPS[stepIndex]!;
  const progressLabel =
    step.type === "ballot"
      ? "Etapa interativa — Urna"
      : `Pergunta ${step.index + 1} de ${TOTAL_QUESTIONS}`;
  const progress =
    phase === "done" ? 100 : ((stepIndex + 1) / (STEPS.length + 1)) * 100;

  const goNext = () => {
    if (stepIndex + 1 >= STEPS.length) setPhase("done");
    else setStepIndex((i) => i + 1);
  };
  const goBack = () => setStepIndex((i) => Math.max(0, i - 1));

  return (
    <div className="min-h-screen bg-background">
      <QuizHeader
        label={phase === "done" ? "Quiz concluído" : progressLabel}
        progress={progress}
      />
      <main className="mx-auto max-w-4xl px-5 py-8 sm:py-12 lg:px-8">
        {phase === "done" ? (
          <div className="animate-fade-in rounded-lg surface-card p-6 text-center sm:p-12">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-10 gold-rule" />
              <span className="eyebrow text-accent">Finalizado</span>
            </div>
            <h1 className="mt-6 font-display text-[clamp(2rem,6vw,3.2rem)] leading-[1.03]">
              QUIZ CONCLUÍDO
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              Você respondeu todas as {TOTAL_QUESTIONS} perguntas e concluiu a
              simulação educativa. Veja agora o resumo das suas respostas.
            </p>
            <button
              type="button"
              onClick={() => setPhase("result")}
              className="group mt-9 inline-flex items-center gap-3 rounded-sm bg-primary px-7 py-4 text-[0.7rem] font-bold tracking-[0.16em] text-primary-foreground uppercase transition-all hover:-translate-y-0.5 hover:bg-gold-soft"
              style={{ boxShadow: "var(--shadow-gold)" }}
            >
              Ver meu resultado
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        ) : step.type === "ballot" ? (
          <ElectronicBallotSimulation
            onBack={goBack}
            onNext={goNext}
            confirmedCode={ballotCode}
            onConfirm={setBallotCode}
          />
        ) : (
          <QuestionCard
            question={QUIZ_QUESTIONS[step.index]!}
            number={step.index + 1}
            total={TOTAL_QUESTIONS}
            selectedId={answers[QUIZ_QUESTIONS[step.index]!.id]}
            onSelect={(optionId) =>
              setAnswers((prev) => ({
                ...prev,
                [QUIZ_QUESTIONS[step.index]!.id]: optionId,
              }))
            }
            onBack={goBack}
            onNext={goNext}
            canGoBack={stepIndex > 0}
            isLast={stepIndex + 1 >= STEPS.length}
          />
        )}
      </main>
    </div>
  );
}

function QuizIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,color-mix(in_oklab,var(--azul)_26%,transparent),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 right-[-12%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--gold)_18%,transparent),transparent_65%)] blur-2xl"
      />
      <div className="h-0.5 w-full gold-rule opacity-80" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8 lg:py-28">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-primary"
          >
            ← Voltar ao Jornal
          </Link>

          <div className="mt-8 flex items-center gap-3">
            <span className="h-px w-12 gold-rule" />
            <span className="eyebrow text-accent">Desafio Editorial</span>
          </div>

          <h1 className="mt-6 font-display text-[clamp(2.6rem,8vw,5.4rem)] leading-[0.92] tracking-[-0.025em]">
            QUIZ
            <span className="block text-primary">DA PÁTRIA</span>
          </h1>

          <p className="mt-7 max-w-xl font-display text-[1.3rem] leading-snug text-foreground/95 sm:text-2xl">
            Teste seus conhecimentos sobre o Brasil, sua história, política e
            instituições.
          </p>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Mais de uma década de acontecimentos ajudou a construir o Brasil que
            conhecemos hoje. Agora é sua vez de testar o que você sabe.
          </p>

          <button
            type="button"
            onClick={onStart}
            className="group mt-10 inline-flex items-center gap-3 rounded-sm bg-primary px-7 py-4 text-xs font-bold tracking-[0.16em] text-primary-foreground uppercase transition-all hover:-translate-y-0.5 hover:bg-gold-soft"
            style={{ boxShadow: "var(--shadow-gold)" }}
          >
            Começar o Quiz
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          <p className="mt-6 text-[0.68rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            {TOTAL_QUESTIONS} perguntas • simulação educativa de urna
          </p>
        </div>

        <div className="grid gap-4">
          {[
            { icon: BookOpen, label: "História", note: "Fatos e períodos" },
            { icon: Landmark, label: "Instituições", note: "Estrutura do Estado" },
            { icon: Target, label: "Atualidades", note: "Acontecimentos públicos" },
            { icon: Vote, label: "Urna interativa", note: "Experiência educativa" },
          ].map((item, i) => (
            <div
              key={item.label}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-md border border-border bg-navy/60 px-5 py-4 transition-all duration-[260ms] hover:-translate-y-0.5 hover:border-primary/50 hover:bg-navy/80"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-border text-primary">
                <item.icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-lg">
                  {item.label}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {item.note}
                </span>
              </span>
              <span className="shrink-0 font-display text-sm text-muted-foreground">
                0{i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
