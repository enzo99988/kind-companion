import q1 from "@/assets/quiz/q1.jpg";
import q2 from "@/assets/quiz/q2.jpg";
import q3 from "@/assets/quiz/q3.jpg";
import q4 from "@/assets/quiz/q4.jpg";
import q5 from "@/assets/quiz/q5.jpg";
import q6 from "@/assets/quiz/q6.jpg";
import q7 from "@/assets/quiz/q7.jpg";
import q8 from "@/assets/quiz/q8.jpg";
import q9 from "@/assets/quiz/q9.jpg";
import q10 from "@/assets/quiz/q10.jpg";
import q11 from "@/assets/quiz/q11.jpg";
import q12 from "@/assets/quiz/q12.jpg";
import q13 from "@/assets/quiz/q13.jpg";
import q14 from "@/assets/quiz/q14.jpg";
import q15 from "@/assets/quiz/q15.jpg";
import q16 from "@/assets/quiz/q16.jpg";

export type QuizOption = {
  id: string;
  label: string;
};

export type QuizQuestion = {
  id: string;
  kind: "knowledge" | "opinion";
  theme: string;
  prompt: string;
  imageCaption: string;
  image: string;
  imageSize?: "default" | "large";
  options: QuizOption[];
  /** only for knowledge questions */
  correctId?: string;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    image: q1,
    kind: "knowledge",
    theme: "Símbolos nacionais",
    prompt: "Quantas estrelas existem hoje na bandeira do Brasil?",
    imageCaption: "Bandeira nacional",
    imageSize: "large",
    options: [
      { id: "a", label: "21 estrelas" },
      { id: "b", label: "27 estrelas" },
      { id: "c", label: "26 estrelas" },
      { id: "d", label: "32 estrelas" },
    ],
    correctId: "b",
  },
  {
    id: "q2",
    image: q2,
    kind: "knowledge",
    theme: "Constituição",
    prompt: "Em que ano foi promulgada a atual Constituição brasileira?",
    imageCaption: "Constituição Federal",
    options: [
      { id: "a", label: "1946" },
      { id: "b", label: "1967" },
      { id: "c", label: "1988" },
      { id: "d", label: "1994" },
    ],
    correctId: "c",
  },
  {
    id: "q3",
    image: q3,
    kind: "knowledge",
    theme: "Instituições",
    prompt: "Quantos ministros compõem o Supremo Tribunal Federal?",
    imageCaption: "Praça dos Três Poderes",
    options: [
      { id: "a", label: "9" },
      { id: "b", label: "11" },
      { id: "c", label: "13" },
      { id: "d", label: "15" },
    ],
    correctId: "b",
  },
  {
    id: "q4",
    image: q4,
    kind: "knowledge",
    theme: "História",
    prompt: "Qual acontecimento marcou o dia 15 de novembro de 1889?",
    imageCaption: "Proclamação da República",
    options: [
      { id: "a", label: "A Independência do Brasil" },
      { id: "b", label: "A Proclamação da República" },
      { id: "c", label: "A abolição da escravidão" },
      { id: "d", label: "A primeira eleição direta" },
    ],
    correctId: "b",
  },
  {
    id: "q5",
    image: q5,
    kind: "opinion",
    theme: "Percepção",
    prompt: "Na sua opinião, o que o Brasil mais precisa hoje?",
    imageCaption: "Panorama do país",
    options: [
      { id: "a", label: "Mais segurança pública" },
      { id: "b", label: "Mais liberdade econômica" },
      { id: "c", label: "Mais educação de qualidade" },
      { id: "d", label: "Mais respeito às instituições" },
    ],
  },
  {
    id: "q6",
    image: q6,
    kind: "knowledge",
    theme: "Conhecimentos cívicos",
    prompt: "Quantos anos dura o mandato de um senador da República?",
    imageCaption: "Senado Federal",
    options: [
      { id: "a", label: "4 anos" },
      { id: "b", label: "6 anos" },
      { id: "c", label: "8 anos" },
      { id: "d", label: "10 anos" },
    ],
    correctId: "c",
  },
  {
    id: "q7",
    image: q7,
    kind: "knowledge",
    theme: "Instituições",
    prompt: "Quem tem a competência de convocar plebiscitos e referendos no Brasil?",
    imageCaption: "Congresso Nacional",
    options: [
      { id: "a", label: "O Congresso Nacional" },
      { id: "b", label: "O Presidente da República, isoladamente" },
      { id: "c", label: "O Supremo Tribunal Federal" },
      { id: "d", label: "Os governadores" },
    ],
    correctId: "a",
  },
  {
    id: "q8",
    image: q8,
    kind: "knowledge",
    theme: "História",
    prompt: "A Lei Áurea, que aboliu a escravidão no Brasil, foi assinada em:",
    imageCaption: "Documento histórico",
    imageSize: "large",
    options: [
      { id: "a", label: "1871" },
      { id: "b", label: "1885" },
      { id: "c", label: "1888" },
      { id: "d", label: "1891" },
    ],
    correctId: "c",
  },
  {
    id: "q9",
    image: q9,
    kind: "opinion",
    theme: "Cultura política",
    prompt: "Como você costuma se informar sobre política no Brasil?",
    imageCaption: "Leitura de jornal",
    options: [
      { id: "a", label: "Jornais e portais de notícias" },
      { id: "b", label: "Redes sociais" },
      { id: "c", label: "Televisão e rádio" },
      { id: "d", label: "Conversas com pessoas próximas" },
    ],
  },
  {
    id: "q10",
    image: q10,
    kind: "knowledge",
    theme: "Símbolos nacionais",
    prompt: "A frase que aparece na bandeira nacional é:",
    imageCaption: "Detalhe da faixa da bandeira",
    options: [
      { id: "a", label: "Ordem e Progresso" },
      { id: "b", label: "Independência ou Morte" },
      { id: "c", label: "Pátria Amada" },
      { id: "d", label: "União e Trabalho" },
    ],
    correctId: "a",
  },
  {
    id: "q11",
    image: q11,
    kind: "knowledge",
    theme: "Eleições",
    prompt: "A partir de qual idade o voto passa a ser obrigatório no Brasil?",
    imageCaption: "Seção eleitoral",
    options: [
      { id: "a", label: "16 anos" },
      { id: "b", label: "18 anos" },
      { id: "c", label: "21 anos" },
      { id: "d", label: "25 anos" },
    ],
    correctId: "b",
  },
  {
    id: "q12",
    image: q12,
    kind: "knowledge",
    theme: "Instituições",
    prompt: "Qual órgão organiza e fiscaliza as eleições no país?",
    imageCaption: "Justiça Eleitoral",
    options: [
      { id: "a", label: "TCU" },
      { id: "b", label: "TSE" },
      { id: "c", label: "STJ" },
      { id: "d", label: "CNJ" },
    ],
    correctId: "b",
  },
  {
    id: "q13",
    image: q13,
    kind: "opinion",
    theme: "Percepção",
    prompt: "Você sente que os acontecimentos públicos são bem explicados pela imprensa?",
    imageCaption: "Redação editorial",
    options: [
      { id: "a", label: "Sim, na maior parte das vezes" },
      { id: "b", label: "Às vezes, depende do tema" },
      { id: "c", label: "Raramente" },
      { id: "d", label: "Não tenho opinião formada" },
    ],
  },
  {
    id: "q14",
    image: q14,
    kind: "knowledge",
    theme: "História recente",
    prompt: "O Plano Real, que criou a moeda atual do Brasil, foi implantado em:",
    imageCaption: "Cédulas do Real",
    options: [
      { id: "a", label: "1986" },
      { id: "b", label: "1990" },
      { id: "c", label: "1994" },
      { id: "d", label: "1999" },
    ],
    correctId: "c",
  },
  {
    id: "q15",
    image: q15,
    kind: "knowledge",
    theme: "Conhecimentos cívicos",
    prompt: "Quantos são os Poderes da República segundo a Constituição?",
    imageCaption: "Três Poderes",
    options: [
      { id: "a", label: "Dois" },
      { id: "b", label: "Três" },
      { id: "c", label: "Quatro" },
      { id: "d", label: "Cinco" },
    ],
    correctId: "b",
  },
  {
    id: "q16",
    image: q16,
    kind: "opinion",
    theme: "Cultura política",
    prompt: "O que mais te faz acompanhar uma notícia até o fim?",
    imageCaption: "Manchete do dia",
    options: [
      { id: "a", label: "Contexto histórico bem explicado" },
      { id: "b", label: "Análise aprofundada" },
      { id: "c", label: "Dados e números" },
      { id: "d", label: "Clareza e objetividade" },
    ],
  },
];

/** Index (0-based) after which the ballot simulation step appears. */
export const BALLOT_AFTER_INDEX = 7;
