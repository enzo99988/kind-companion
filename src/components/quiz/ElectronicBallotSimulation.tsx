import { useState } from "react";
import { ArrowLeft, ArrowRight, Camera, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

export function ElectronicBallotSimulation({
  onBack,
  onNext,
  confirmedCode,
  onConfirm,
}: {
  onBack: () => void;
  onNext: () => void;
  confirmedCode?: string | undefined;
  onConfirm: (code: string) => void;
}) {
  const [digits, setDigits] = useState(confirmedCode ?? "");
  const [status, setStatus] = useState<"idle" | "ok" | "invalid">(
    confirmedCode === "22" ? "ok" : "idle",
  );
  const done = status === "ok";

  const press = (key: string) => {
    if (done) return;
    setStatus("idle");
    setDigits((d) => (d.length >= 2 ? d : d + key));
  };

  const confirm = () => {
    if (digits.length < 2) return;
    if (digits === "22") {
      setStatus("ok");
      onConfirm(digits);
    } else {
      setStatus("invalid");
    }
  };

  const correct = () => {
    setStatus("idle");
    setDigits("");
  };

  return (
    <article className="animate-fade-in rounded-lg surface-card p-5 sm:p-8 lg:p-10">
      <div className="flex items-center gap-3">
        <span className="h-px w-8 gold-rule" />
        <span className="eyebrow text-accent">Etapa interativa</span>
      </div>
      <h1 className="mt-5 font-display text-[clamp(1.5rem,5vw,2.3rem)] leading-[1.1]">
        SIMULAÇÃO EDUCATIVA DE URNA
      </h1>
      <p className="mt-4 flex items-start gap-2 rounded-md border border-accent/40 bg-navy/60 p-4 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        Esta é uma <strong className="text-foreground/90">simulação educativa</strong> e
        não representa a interface oficial da urna eletrônica brasileira nem
        registra qualquer voto. Digite dois números para experimentar.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ballot body */}
        <div className="rounded-lg border border-border bg-[linear-gradient(165deg,oklch(0.62_0.005_260),oklch(0.42_0.005_260))] p-4 sm:p-6">
          <div className="rounded-md border border-navy-deep/40 bg-navy-deep/90 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.6rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  Simulação
                </p>
                <p className="mt-2 font-display text-2xl tracking-[0.3em] text-primary">
                  {(digits.padEnd(2, "–").slice(0, 2) || "––")
                    .split("")
                    .join(" ")}
                </p>
                {done ? (
                  <p className="mt-3 animate-scale-in text-[0.65rem] font-semibold tracking-[0.16em] text-accent uppercase">
                    Simulação concluída
                  </p>
                ) : status === "invalid" ? (
                  <p className="mt-3 animate-fade-in text-[0.65rem] font-semibold tracking-[0.14em] text-primary uppercase">
                    Opção inválida
                  </p>
                ) : (
                  <p className="mt-3 text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
                    Digite o número
                  </p>
                )}
              </div>
              <div className="grid h-20 w-16 shrink-0 place-items-center rounded-sm border border-border bg-navy/70 text-muted-foreground">
                <Camera className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-5 gap-2">
            {KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => press(k)}
                className="rounded-sm border border-navy-deep/30 bg-navy-deep/80 py-3 font-display text-lg text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary active:translate-y-0"
              >
                {k}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={correct}
              className="rounded-sm border border-border bg-navy-deep/80 px-4 py-3 text-[0.65rem] font-bold tracking-[0.16em] text-foreground uppercase transition-colors hover:text-primary"
            >
              Corrigir
            </button>
            <button
              type="button"
              onClick={confirm}
              disabled={digits.length < 2 || done}
              className={cn(
                "rounded-sm px-4 py-3 text-[0.65rem] font-bold tracking-[0.16em] uppercase transition-all",
                done
                  ? "bg-accent text-accent-foreground"
                  : "bg-[linear-gradient(90deg,var(--verde),var(--gold))] text-primary-foreground hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0",
              )}
            >
              {done ? "Confirmado" : "Confirmar"}
            </button>
          </div>
        </div>

        {/* explanation */}
        <div className="grid content-start gap-4">
          {[
            "A urna eletrônica foi adotada no Brasil em 1996.",
            "O eleitor digita o número, confere os dados na tela e confirma.",
            "A tecla CORRIGIR permite refazer a digitação antes de confirmar.",
          ].map((text, i) => (
            <div
              key={text}
              className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 rounded-md border border-border bg-navy/60 px-5 py-4"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border border-border font-display text-sm text-primary">
                0{i + 1}
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
          {done ? (
            <div className="animate-scale-in rounded-md border border-accent/50 bg-[color-mix(in_oklab,var(--verde)_12%,var(--navy))] px-5 py-6 text-center sm:text-left">
              <span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-accent text-accent-foreground sm:mx-0">
                <Check className="h-4 w-4" />
              </span>
              <p className="mt-4 font-display text-xl tracking-tight text-foreground">
                SIMULAÇÃO CONCLUÍDA
              </p>
              <p className="mt-2 text-sm text-foreground/95">
                Você selecionou a opção{" "}
                <span className="font-display text-lg text-primary">22</span>.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Esta é uma simulação educativa. Nenhum voto real foi registrado.
              </p>
              <button
                type="button"
                onClick={onNext}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-[0.68rem] font-bold tracking-[0.16em] text-primary-foreground uppercase transition-all hover:-translate-y-0.5 hover:bg-gold-soft sm:w-auto"
                style={{ boxShadow: "var(--shadow-gold)" }}
              >
                Continuar Quiz
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : status === "invalid" ? (
            <div className="animate-fade-in rounded-md border border-primary/50 bg-navy/70 px-5 py-4">
              <p className="text-sm text-foreground/95">
                Opção inválida. Confira o número digitado e tente novamente.
              </p>
              <button
                type="button"
                onClick={correct}
                className="mt-4 inline-flex w-full items-center justify-center rounded-sm border border-border px-5 py-3 text-[0.65rem] font-bold tracking-[0.16em] uppercase transition-colors hover:border-primary/60 hover:text-primary sm:w-auto"
              >
                Corrigir escolha
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-sm border border-border px-6 py-4 text-[0.7rem] font-bold tracking-[0.16em] uppercase transition-colors hover:border-primary/60 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!done}
          className="group inline-flex items-center justify-center gap-3 rounded-sm bg-primary px-7 py-4 text-[0.7rem] font-bold tracking-[0.16em] text-primary-foreground uppercase transition-all hover:-translate-y-0.5 hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
          style={{ boxShadow: "var(--shadow-gold)" }}
        >
          Próxima pergunta
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      {!done ? (
        <p className="mt-3 text-center text-[0.68rem] tracking-[0.12em] text-muted-foreground uppercase sm:text-right">
          Confirme a simulação para avançar
        </p>
      ) : null}
    </article>
  );
}
