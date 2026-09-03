import { Link } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { QUIZ_QUESTIONS } from "@/lib/quiz-data";
import { cn } from "@/lib/utils";

export function QuizResult({
  answers,
  ballotCode,
  onRestart,
}: {
  answers: Record<string, string>;
  ballotCode?: string | undefined;
  onRestart: () => void;
}) {
  const knowledge = QUIZ_QUESTIONS.filter((q) => q.kind === "knowledge");
  const opinions = QUIZ_QUESTIONS.filter((q) => q.kind === "opinion");
  const score = knowledge.filter((q) => answers[q.id] === q.correctId).length;
  const percent = Math.round((score / knowledge.length) * 100);
  const verdict =
    percent >= 100
      ? {
          title: "IMPOSSÍVEL NÃO NOTAR",
          text: "Impressionante. Você atingiu um nível de conhecimento muito alto. Continue acompanhando o Jornal da Pátria para se manter informado.",
        }
      : percent >= 90
        ? {
            title: "EXCELENTE",
            text: "Você está muito bem informado. Continue acompanhando os principais acontecimentos da direita brasileira com o Jornal da Pátria.",
          }
        : percent >= 60
          ? {
              title: "MUITO BOM",
              text: "Você demonstrou um ótimo nível de conhecimento. Aprimore ainda mais sua visão sobre os acontecimentos da direita brasileira com o Jornal da Pátria.",
            }
          : percent >= 30
            ? {
                title: "BOM COMEÇO",
                text: "Você está no caminho. Continue acompanhando os acontecimentos da política brasileira e amplie seus conhecimentos com o Jornal da Pátria.",
              }
            : {
                title: "AINDA HÁ MUITO A DESCOBRIR",
                text: "Bom começo. Explore o Jornal da Pátria e aprofunde seus conhecimentos sobre a política e os acontecimentos da direita brasileira.",
              };

  return (
    <div className="animate-fade-in mx-auto max-w-4xl px-5 py-12 lg:px-8 lg:py-20">
      <div className="rounded-lg surface-card p-6 sm:p-10 lg:p-14">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 gold-rule" />
          <span className="eyebrow text-accent">Resultado</span>
        </div>
        <h1 className="mt-6 font-display text-[clamp(2rem,6vw,3.4rem)] leading-[1.02] tracking-[-0.02em]">
          QUIZ CONCLUÍDO
        </h1>

        <div className="mt-9 grid gap-4 sm:grid-cols-3">
          <div className="rounded-md border border-primary/40 bg-navy/60 px-5 py-6 text-center">
            <p className="font-display text-4xl text-primary">
              {score}/{knowledge.length}
            </p>
            <p className="mt-2 text-[0.6rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Acertos de conhecimento
            </p>
          </div>
          <div className="rounded-md border border-accent/40 bg-navy/60 px-5 py-6 text-center">
            <p className="font-display text-4xl text-accent">{percent}%</p>
            <p className="mt-2 text-[0.6rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Aproveitamento
            </p>
          </div>
          <div className="rounded-md border border-border bg-navy/60 px-5 py-6 text-center">
            <p className="font-display text-4xl text-foreground">
              {opinions.length}
            </p>
            <p className="mt-2 text-[0.6rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Respostas de opinião
            </p>
          </div>
        </div>

        <section className="animate-scale-in mt-8 rounded-lg border border-accent/40 bg-[color-mix(in_oklab,var(--verde)_10%,var(--navy))] px-6 py-8 text-center sm:px-10 sm:py-10">
          <p className="font-display text-[clamp(3rem,13vw,5rem)] leading-none text-primary">
            {percent}%
          </p>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 gold-rule" />
            <span className="eyebrow text-accent">Classificação</span>
            <span className="h-px w-8 gold-rule" />
          </div>
          <h2 className="mt-4 font-display text-[clamp(1.4rem,6vw,2.4rem)] leading-[1.05] tracking-tight text-foreground">
            {verdict.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {verdict.text}
          </p>
        </section>

        <h2 className="mt-12 font-display text-xl tracking-tight">
          Perguntas de conhecimento
        </h2>
        <ul className="mt-5 grid gap-3">
          {knowledge.map((q, i) => {
            const chosen = q.options.find((o) => o.id === answers[q.id]);
            const ok = answers[q.id] === q.correctId;
            return (
              <li
                key={q.id}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 rounded-md border border-border bg-navy/60 px-5 py-4"
              >
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full",
                    ok
                      ? "bg-accent text-accent-foreground"
                      : "bg-navy-soft text-muted-foreground",
                  )}
                >
                  {ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-foreground/95">
                    {i + 1}. {q.prompt}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Sua resposta: {chosen?.label ?? "—"}
                    {!ok
                      ? ` • Correta: ${q.options.find((o) => o.id === q.correctId)?.label}`
                      : ""}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <h2 className="mt-12 font-display text-xl tracking-tight">
          Suas opiniões
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Estas respostas não são pontuadas nem classificadas.
        </p>
        <ul className="mt-5 grid gap-3">
          {opinions.map((q) => (
            <li
              key={q.id}
              className="rounded-md border border-accent/30 bg-navy/60 px-5 py-4"
            >
              <p className="text-sm text-foreground/95">{q.prompt}</p>
              <p className="mt-1 text-xs text-accent">
                {q.options.find((o) => o.id === answers[q.id])?.label ?? "—"}
              </p>
            </li>
          ))}
        </ul>

        {ballotCode ? (
          <p className="mt-10 rounded-md border border-border bg-navy/60 px-5 py-4 text-xs text-muted-foreground">
            Na simulação educativa de urna você digitou{" "}
            <span className="font-display text-base text-primary">{ballotCode}</span>.
            Nenhum voto foi registrado.
          </p>
        ) : null}

        <p className="mt-11 text-center font-display text-[clamp(1.2rem,4.6vw,1.7rem)] leading-snug text-foreground sm:text-left">
          Quer continuar acompanhando os acontecimentos?
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/oferta"
            className="inline-flex items-center justify-center rounded-sm bg-primary px-7 py-4 text-center text-[0.7rem] font-bold tracking-[0.16em] text-primary-foreground uppercase transition-all hover:-translate-y-0.5 hover:bg-gold-soft"
            style={{ boxShadow: "var(--shadow-gold)" }}
          >
            Conheça o Jornal da Pátria
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm border border-border px-7 py-4 text-[0.7rem] font-bold tracking-[0.16em] uppercase transition-colors hover:border-primary/60 hover:text-primary"
          >
            Voltar ao Jornal
          </Link>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center justify-center rounded-sm border border-border px-7 py-4 text-[0.7rem] font-bold tracking-[0.16em] uppercase transition-colors hover:border-accent/60 hover:text-accent"
          >
            Refazer o Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
