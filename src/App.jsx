import React, { useState, useEffect, useMemo } from "react";
import {
  Activity,
  Scale,
  Utensils,
  Pill,
  Layers,
  TrendingUp,
  Plus,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  ChevronRight,
  Info,
  AlertTriangle,
  BookOpen,
  Ruler,
  Sparkles,
  CheckCircle2,
  Search,
  User,
  Calendar,
  Sliders,
  ShieldAlert,
  FileText,
  ArrowUpRight,
} from "lucide-react";

const STORAGE_KEY = "nexusprotocol_v1_state";

const DEFAULT_FOODS = [
  { id: "f1", name: "Peito de frango grelhado (100g)", kcal: 165, p: 31, c: 0, g: 3.6, group: "Proteína" },
  { id: "f2", name: "Ovo inteiro cozido (1 un. ~50g)", kcal: 72, p: 6.3, c: 0.4, g: 4.8, group: "Proteína" },
  { id: "f3", name: "Clara de ovo (100g)", kcal: 52, p: 10.9, c: 0.7, g: 0.2, group: "Proteína" },
  { id: "f4", name: "Patinho bovino grelhado (100g)", kcal: 219, p: 35.9, c: 0, g: 7.3, group: "Proteína" },
  { id: "f5", name: "Tilápia grelhada (100g)", kcal: 128, p: 26.2, c: 0, g: 2.7, group: "Proteína" },
  { id: "f6", name: "Whey protein concentrado (30g)", kcal: 120, p: 24, c: 2.5, g: 1.5, group: "Proteína" },
  { id: "f7", name: "Iogurte natural desnatado (170g)", kcal: 74, p: 7.2, c: 9.5, g: 0.4, group: "Laticínio" },
  { id: "f8", name: "Queijo minas frescal (100g)", kcal: 264, p: 17.4, c: 3.2, g: 20.2, group: "Laticínio" },
  { id: "f9", name: "Queijo muçarela light (30g)", kcal: 78, p: 7.5, c: 1.0, g: 4.8, group: "Laticínio" },
  { id: "f10", name: "Batata inglesa cozida (100g)", kcal: 86, p: 1.7, c: 20.1, g: 0.1, group: "Carboidrato" },
  { id: "f11", name: "Arroz branco cozido (100g)", kcal: 130, p: 2.7, c: 28.2, g: 0.3, group: "Carboidrato" },
  { id: "f12", name: "Aveia em flocos (40g)", kcal: 152, p: 5.5, c: 26.5, g: 2.8, group: "Carboidrato" },
  { id: "f13", name: "Torrada integral / Levtoast (2 un.)", kcal: 76, p: 2.6, c: 14.2, g: 0.9, group: "Carboidrato" },
  { id: "f14", name: "Banana prata média (80g)", kcal: 78, p: 1.0, c: 20.1, g: 0.2, group: "Carboidrato" },
  { id: "f15", name: "Doce de leite pastoso (20g)", kcal: 62, p: 1.4, c: 11.2, g: 1.3, group: "Carboidrato" },
  { id: "f16", name: "Amendoim torrado sem sal (30g)", kcal: 176, p: 7.8, c: 4.8, g: 14.8, group: "Gordura" },
  { id: "f17", name: "Azeite de oliva extravirgem (10ml)", kcal: 88, p: 0, c: 0, g: 10.0, group: "Gordura" },
  { id: "f18", name: "Abacate / Avocado (100g)", kcal: 160, p: 2.0, c: 8.5, g: 14.7, group: "Gordura" },
];

const DRUG_CATALOG = [
  {
    id: "semaglutida",
    name: "Semaglutida",
    nicknames: ["Ozempic", "Wegovy", "Rybelsus"],
    category: "Peptídeos Metabólicos & Incretinas",
    route: "SC semanal (ou VO diário)",
    halfLifeHours: 168,
    intervalDays: 7,
    defaultDoseMg: 0.5,
    unit: "mg",
    peakDays: 2,
    steadyStateWeeks: 4,
    potencyFactor: 1.0,
    summary:
      "Análogo do peptídeo semelhante ao glucagon-1 (GLP-1) com resistência à degradação pela DPP-4, promovendo secreção de insulina glicose-dependente, supressão do glucagon e retardo do esvaziamento gástrico.",
    mechanism:
      "Liga-se seletivamente aos receptores de GLP-1 no pâncreas (estimulando liberação de insulina apenas na presença de hiperglicemia e reduzindo secreção pós-prandial de glucagon) e em núcleos hipotalâmicos e do tronco cerebral ligados à saciedade e ao controle do apetite. Também reduz a velocidade de esvaziamento gástrico nas fases iniciais do tratamento.",
    studies:
      "Nos ensaios clínicos da família STEP (ex.: STEP 1 em obesidade sem diabetes), doses escalonadas até 2,4 mg/semana associaram-se a redução média de peso corporal em torno de ~14,9% em 68 semanas versus ~2,4% com placebo, além de melhora de marcadores cardiometabólicos e redução de eventos cardiovasculares maiores no estudo SELECT.",
    sideEffects: [
      "Náusea, plenitude gástrica, refluxo, constipação ou diarreia (mais frequentes na titulação)",
      "Redução acentuada do apetite e risco de baixa ingestão proteica se não houver planejamento",
      "Atenção clínica a colelitíase, pancreatite aguda e desidratação",
    ],
    contraindications: [
      "Histórico pessoal ou familiar de carcinoma medular de tireoide (CMT) ou NEM tipo 2",
      "Gestação, lactação ou hipersensibilidade conhecida ao princípio ativo",
    ],
    monitoring: ["HbA1c e glicemia de jejum", "Função renal e hidratação", "Perfil lipídico e enzimas hepáticas"],
    timelines: {
      early: "Semanas 1–2: Início do sinal de saciedade precoce e possível desconforto GI leve; concentração plasmática ainda em ascensão.",
      mid: "Semanas 4–8: Aproximação do estado estacionário (4–5 meias-vidas); redução mais consistente da ingestão calórica espontânea.",
      late: "Semanas 12+: Consolidação da perda ponderal, exigindo vigilância de massa magra com aporte proteico e treino resistido.",
    },
  },
  {
    id: "tirzepatida",
    name: "Tirzepatida",
    nicknames: ["Mounjaro", "Zepbound"],
    category: "Peptídeos Metabólicos & Incretinas",
    route: "SC semanal",
    halfLifeHours: 120,
    intervalDays: 7,
    defaultDoseMg: 5,
    unit: "mg",
    peakDays: 1.5,
    steadyStateWeeks: 4,
    potencyFactor: 1.15,
    summary:
      "Agonista duplo dos receptores de GIP (polipeptídeo insulinotrópico dependente de glicose) e GLP-1, desenhado para ação metabólica e incretínica combinada.",
    mechanism:
      "Ativa tanto receptores GIP quanto GLP-1. O agonismo de GLP-1 modula saciedade, esvaziamento gástrico e secreção glicose-dependente de insulina, enquanto a ativação de receptores GIP participa da sinalização adipocitária e potencializa a resposta insulínica em modelos clínicos.",
    studies:
      "Nos programas SURMOUNT (como SURMOUNT-1), o escalonamento até 5 mg, 10 mg e 15 mg semanais demonstrou reduções médias de peso corporal dose-dependentes (chegando a ~15% a ~20,9% em 72 semanas nas maiores doses avaliadas, frente a ~3,1% no placebo), além de melhoras expressivas em sensibilidade à insulina e circunferência da cintura.",
    sideEffects: [
      "Náuseas, diarreia, vômitos ou constipação durante ajustes de dose",
      "Saciedade intensa com risco de déficit energético excessivo se não monitorado",
      "Monitorar sinais de desidratação ou dor abdominal persistente",
    ],
    contraindications: [
      "Histórico pessoal ou familiar de carcinoma medular de tireoide (CMT) ou NEM tipo 2",
      "Gestação, lactação ou hipersensibilidade ao fármaco",
    ],
    monitoring: ["Glicemia de jejum / HbA1c", "Eletrólitos e função renal", "Composição corporal (massa magra vs. gordura)"],
    timelines: {
      early: "Semanas 1–2: Resposta rápida na sinalização de saciedade e redução do impulso alimentar; adaptação GI inicial.",
      mid: "Semanas 4–8: Estabilização da curva semanal; queda expressiva do apetite e necessidade de priorizar proteína por refeição.",
      late: "Semanas 12+: Fase de perda ponderal sustentada ou ajuste de dose de manutenção conforme metas clínicas.",
    },
  },
  {
    id: "liraglutida",
    name: "Liraglutida",
    nicknames: ["Saxenda", "Victoza"],
    category: "Peptídeos Metabólicos & Incretinas",
    route: "SC diário",
    halfLifeHours: 13,
    intervalDays: 1,
    defaultDoseMg: 1.8,
    unit: "mg",
    peakDays: 0.5,
    steadyStateWeeks: 1,
    potencyFactor: 0.85,
    summary:
      "Agonista de receptor de GLP-1 de administração diária e meia-vida mais curta (~13 horas), permitindo ajustes diários de tolerabilidade.",
    mechanism:
      "Estimula a liberação de insulina dependente de glicose, reduz a secreção inadequada de glucagon e atua em centros hipotalâmicos de saciedade, retardando o esvaziamento gástrico.",
    studies:
      "No estudo SCALE Obesity and Prediabetes (3,0 mg/dia), promoveu redução média de cerca de ~8,0% do peso corporal em 56 semanas versus ~2,6% com placebo, além de redução na prevalência de pré-diabetes.",
    sideEffects: [
      "Náuseas, diarreia, constipação e cefaleia nas primeiras semanas",
      "Aumento discreto da frequência cardíaca de repouso em alguns indivíduos",
    ],
    contraindications: [
      "Histórico de CMT ou NEM tipo 2",
      "Gestação, lactação ou hipersensibilidade",
    ],
    monitoring: ["HbA1c e glicemia", "Frequência cardíaca e pressão arterial", "Função renal"],
    timelines: {
      early: "Semanas 1–2: Atinge platô diário rapidamente devido à meia-vida de ~13h; titulação gradual ajuda na tolerância GI.",
      mid: "Semanas 4–8: Controle diário estável do apetite; vantagem de poder pausar/ajustar com menor persistência residual.",
      late: "Semanas 12+: Avaliação de resposta clínica (meta clássica de ≥5% de perda ponderal em 12 semanas na dose alvo).",
    },
  },
  {
    id: "dulaglutida",
    name: "Dulaglutida",
    nicknames: ["Trulicity"],
    category: "Peptídeos Metabólicos & Incretinas",
    route: "SC semanal",
    halfLifeHours: 112,
    intervalDays: 7,
    defaultDoseMg: 1.5,
    unit: "mg",
    peakDays: 2,
    steadyStateWeeks: 3,
    potencyFactor: 0.82,
    summary:
      "Agonista de receptor de GLP-1 conjugado a fragmento Fc de IgG4 humana, de aplicação semanal.",
    mechanism:
      "Aumenta o AMPc intracelular nas células beta pancreáticas na presença de glicose elevada, suprime glucagon e modula saciedade via GLP-1.",
    studies:
      "Nos programas AWARD e no estudo cardiovascular REWIND, demonstrou redução sustentada de HbA1c em diabetes tipo 2 e redução de desfechos cardiovasculares adversos maiores.",
    sideEffects: [
      "Náusea, vômito, diarreia e dor abdominal leve a moderada",
      "Plenitude pós-prandial",
    ],
    contraindications: [
      "Histórico de CMT ou NEM tipo 2",
      "Gestação ou lactação",
    ],
    monitoring: ["HbA1c", "Função renal", "Sintomas gastrointestinais"],
    timelines: {
      early: "Semanas 1–2: Início da modulação glicêmica e saciedade moderada.",
      mid: "Semanas 4–8: Estabilização das concentrações semanais e redução de picos glicêmicos pós-prandiais.",
      late: "Semanas 12+: Consolidação do controle glicêmico e metabólico.",
    },
  },
  {
    id: "durateston",
    name: "Associação de Ésteres de Testosterona",
    nicknames: ["Durateston", "Sustanon 250"],
    category: "Hormônios & Reposição (TRT)",
    route: "IM profunda (intervalo variável conforme prescrição)",
    halfLifeHours: 216,
    intervalDays: 14,
    defaultDoseMg: 250,
    unit: "mg",
    peakDays: 2,
    steadyStateWeeks: 5,
    potencyFactor: 1.0,
    isMultiEster: true,
    summary:
      "Blend de quatro ésteres de testosterona (propionato 30 mg, fempropionato 60 mg, isocaproato 60 mg e decanoato 100 mg a cada 250 mg) com liberação escalonada.",
    mechanism:
      "Atua via receptor androgênico intracelular regulando transcrição gênica ligada a síntese proteica muscular, eritropoiese, densidade mineral óssea, libido e manutenção de caracteres sexuais secundários. A combinação de ésteres curtos e longos gera liberação mais rápida no início e cauda prolongada pelo decanoato.",
    studies:
      "Em diretrizes de terapia de reposição de testosterona (TRT) para hipogonadismo masculino confirmado clínica e laboratorialmente, a reposição androgênica melhora sintomas de deficiência androgênica, massa magra e densidade óssea, exigindo monitoramento de hematócrito, PSA, perfil lipídico e estradiol.",
    sideEffects: [
      "Aumento de hematócrito/hemoglobina (risco de policitemia), retenção hídrica ou acne/oleosidade",
      "Supressão do eixo hipotálamo-hipófise-gonadal (LH/FSH) e redução da espermatogênese/fertilidade",
      "Alterações em colesterol HDL/LDL, pressão arterial ou sensibilidade mamária (conversão via aromatase)",
    ],
    contraindications: [
      "Carcinoma de próstata ou carcinoma de mama masculino suspeito ou confirmado",
      "Hematócrito basal elevado sem investigação, apneia do sono grave não tratada ou desejo imediato de fertilidade sem manejo específico",
    ],
    monitoring: ["Testosterona total e livre, LH, FSH e estradiol", "Hemograma completo (hematócrito)", "PSA, perfil lipídico, função hepática e PA"],
    timelines: {
      early: "Semanas 1–2: Pico inicial mais precoce pelos ésteres curtos (propionato/fempropionato) e início de retenção hídrica ou mudanças de humor/energia.",
      mid: "Semanas 4–8: Acúmulo do éster mais longo (decanoato) e supressão progressiva de LH/FSH endógenos.",
      late: "Semanas 12+: Avaliação laboratorial de vale/pico, hematócrito e resposta clínica em massa magra, força e composição corporal.",
    },
  },
  {
    id: "cipionato",
    name: "Cipionato de Testosterona",
    nicknames: ["Deposteron"],
    category: "Hormônios & Reposição (TRT)",
    route: "IM profunda",
    halfLifeHours: 192,
    intervalDays: 7,
    defaultDoseMg: 100,
    unit: "mg",
    peakDays: 2,
    steadyStateWeeks: 4,
    potencyFactor: 0.96,
    summary:
      "Éster de testosterona de ação intermediária (~8 dias de meia-vida), amplamente utilizado em protocolos regulamentados de reposição hormonal masculina.",
    mechanism:
      "Após injeção intramuscular em veículo oleoso, o cipionato é liberado gradualmente e clivado por esterases em testosterona livre, ligando-se a receptores androgênicos nucleares.",
    studies:
      "Estudos clínicos de reposição androgênica demonstram melhora de sintomas hipogonádicos, composição corporal e densidade mineral óssea quando os níveis séricos são mantidos na faixa fisiológica alvo.",
    sideEffects: [
      "Elevação de hematócrito, oleosidade cutânea, acne ou alterações lipídicas",
      "Supressão do eixo HPG e redução da contagem espermática",
      "Possível elevação de estradiol por aromatização",
    ],
    contraindications: [
      "Câncer de próstata ou de mama masculino",
      "Hematócrito elevado não controlado ou gestação/lactação",
    ],
    monitoring: ["Testosterona total/livre e estradiol", "Hemograma (hematócrito)", "PSA e perfil lipídico"],
    timelines: {
      early: "Semanas 1–2: Início da elevação sérica após aplicações e adaptação androgênica.",
      mid: "Semanas 4–8: Aproximação do estado estacionário com curvas mais previsíveis conforme frequência de aplicação.",
      late: "Semanas 12+: Revisão de exames laboratoriais e ajuste fino de dose/intervalo.",
    },
  },
  {
    id: "undecanoato",
    name: "Undecanoato de Testosterona",
    nicknames: ["Nebido", "Hormus"],
    category: "Hormônios & Reposição (TRT)",
    route: "IM profunda de longa duração",
    halfLifeHours: 600,
    intervalDays: 70,
    defaultDoseMg: 1000,
    unit: "mg",
    peakDays: 7,
    steadyStateWeeks: 18,
    potencyFactor: 1.0,
    summary:
      "Éster de cadeia longa (~25 dias de meia-vida em formulação oleosa), projetado para intervalos espaçados (ex.: 10 a 12 semanas após dose de ataque).",
    mechanism:
      "A longa cadeia carbônica retarda a liberação do depósito intramuscular, produzindo níveis de testosterona mais estáveis entre aplicações em comparação a ésteres curtos.",
    studies:
      "Ensaios clínicos de TRT demonstraram manutenção estável da testosterona sérica em faixa fisiológica com menor frequência de injeções e melhora de parâmetros metabólicos e sexuais em homens com hipogonadismo.",
    sideEffects: [
      "Aumento de hematócrito, dor local transitória ou alterações lipídicas",
      "Supressão do eixo HPG e da fertilidade",
      "Raro: microembolia pulmonar oleosa imediata à aplicação (técnica de injeção lenta e criteriosa)",
    ],
    contraindications: [
      "Carcinoma de próstata ou mama masculino",
      "Hipersensibilidade ou hematócrito elevado sem controle",
    ],
    monitoring: ["Testosterona de vale antes da próxima dose", "Hemograma (hematócrito)", "PSA, lipidograma e função hepática"],
    timelines: {
      early: "Semanas 1–2: Elevação gradual após aplicação inicial.",
      mid: "Semanas 4–8: Período de ajuste (especialmente quando há dose de reforço inicial de 6 semanas em bula).",
      late: "Semanas 12+: Avaliação da concentração de vale e estabilização de longo prazo.",
    },
  },
  {
    id: "gel_testosterona",
    name: "Testosterona Transdérmica (Gel)",
    nicknames: ["Androgel"],
    category: "Hormônios & Reposição (TRT)",
    route: "Transdérmica diária",
    halfLifeHours: 24,
    intervalDays: 1,
    defaultDoseMg: 50,
    unit: "mg",
    peakDays: 0.2,
    steadyStateWeeks: 1,
    potencyFactor: 0.75,
    summary:
      "Gel hidroalcoólico de aplicação tópica diária que forma reservatório no estrato córneo para absorção contínua ao longo de 24 horas.",
    mechanism:
      "Difunde-se pela pele até a circulação sistêmica sem passagem hepática de primeira passagem, reproduzindo perfil diário mais uniforme sem picos intensos de ésteres injetáveis.",
    studies:
      "Estudos controlados em hipogonadismo masculino mostram restauração de níveis séricos fisiológicos de testosterona, melhora de humor, energia e massa magra, com atenção à transferência secundária por contato cutâneo.",
    sideEffects: [
      "Irritação local na pele ou alteração de exames androgênicos",
      "Risco de transferência cutânea acidental para parceiros(as) ou crianças se não lavar as mãos ou cobrir o local",
    ],
    contraindications: [
      "Câncer de próstata ou mama masculino",
      "Aplicação sobre pele lesionada ou contato direto sem proteção após aplicação",
    ],
    monitoring: ["Testosterona sérica (colhida conforme orientação temporal da bula)", "Hematócrito, PSA e perfil lipídico"],
    timelines: {
      early: "Semanas 1–2: Estabilização rápida do ritmo diário de aplicação.",
      mid: "Semanas 4–8: Consolidação do perfil diário e revisão de adesão/absorção.",
      late: "Semanas 12+: Reavaliação clínica e laboratorial completa.",
    },
  },
  {
    id: "levotiroxina",
    name: "Levotiroxina Sódica (T4)",
    nicknames: ["Puran T4", "Euthyrox", "Synthroid"],
    category: "Eixo Tireoidiano",
    route: "VO diário em jejum",
    halfLifeHours: 168,
    intervalDays: 1,
    defaultDoseMg: 0.075,
    unit: "mg",
    peakDays: 0.2,
    steadyStateWeeks: 6,
    potencyFactor: 0.9,
    summary:
      "Hormônio tireoidiano sintético (T4) que atua como pró-hormônio periférico, convertido em triiodotironina (T3) ativa por desiodases.",
    mechanism:
      "Liga-se a receptores nucleares de hormônios tireoidianos (TR-alfa e TR-beta) após conversão periférica de T4 em T3, regulando taxa metabólica basal, expressão de receptores beta-adrenérgicos, síntese proteica e metabolismo lipídico/glicídico.",
    studies:
      "Em diretrizes de hipotireoidismo, a reposição com levotiroxina restaura o eutireoidismo clínico e laboratorial (TSH e T4 livre), exigindo cerca de 4 a 6 semanas após cada ajuste de dose para reavaliação do TSH.",
    sideEffects: [
      "Sinais de excesso/superdosagem: palpitações, taquicardia, ansiedade, insônia, tremor, sudorese ou perda ponderal não intencional",
      "Atenção à absorção: ferro, cálcio, antiácidos, café ou refeições próximas podem reduzir a biodisponibilidade",
    ],
    contraindications: [
      "Tireotoxicose não tratada, insuficiência adrenal não corrigida ou infarto agudo do miocárdio recente sem manejo adequado",
    ],
    monitoring: ["TSH e T4 livre (após 4–6 semanas de dose estável)", "Frequência cardíaca e sintomas adrenérgicos"],
    timelines: {
      early: "Semanas 1–2: Início do acúmulo de T4 (meia-vida ~7 dias); TSH ainda não reflete o estado estacionário completo.",
      mid: "Semanas 4–8: Aproximação do equilíbrio de T4 e conversão periférica em T3; momento clássico para checar TSH/T4L.",
      late: "Semanas 12+: Manutenção do eixo estável ou ajuste fino conforme resposta clínica e laboratorial.",
    },
  },
  {
    id: "liotironina",
    name: "Liotironina Sódica (T3)",
    nicknames: ["Cynomel"],
    category: "Eixo Tireoidiano",
    route: "VO diário (1 a 2 tomadas)",
    halfLifeHours: 24,
    intervalDays: 1,
    defaultDoseMg: 0.025,
    unit: "mg",
    peakDays: 0.15,
    steadyStateWeeks: 1,
    potencyFactor: 1.1,
    summary:
      "Forma sintética do hormônio tireoidiano ativo T3, com início de ação mais rápido e meia-vida em torno de 24 horas.",
    mechanism:
      "Exerce ação direta sobre receptores nucleares de hormônios tireoidianos sem depender de desiodação periférica prévia, elevando a atividade metabólica e o consumo energético celular.",
    studies:
      "Estudos clínicos avaliam a liotironina em cenários específicos de tireoidologia e terapia combinada T4+T3 em pacientes selecionados, destacando maior sensibilidade a oscilações de dose e efeitos cardiovasculares em comparação ao T4 isolado.",
    sideEffects: [
      "Taquicardia, palpitações, arritmias, nervosismo, insônia ou intolerância ao calor",
      "Risco aumentado de catabolismo proteico e sobrecarga cardíaca se usado em doses excessivas",
    ],
    contraindications: [
      "Tireotoxicose, insuficiência adrenal não tratada ou arritmias/cardiopatia isquêmica descompensada",
    ],
    monitoring: ["TSH, T4 livre e T3 livre", "Frequência cardíaca, pressão arterial e eletrocardiograma se indicado"],
    timelines: {
      early: "Semanas 1–2: Resposta metabólica e simpática rápida devido à meia-vida curta (~24h).",
      mid: "Semanas 4–8: Avaliação de tolerância cardiovascular, sono e estabilidade energética.",
      late: "Semanas 12+: Reavaliação médica periódica para evitar excesso tireoidiano subclínico.",
    },
  },
  {
    id: "metformina",
    name: "Metformina (IR / XR)",
    nicknames: ["Glifage", "Glifage XR"],
    category: "Metabolismo Glicídico, Lipídico & Cardiometabólico",
    route: "VO diário (com refeições)",
    halfLifeHours: 6,
    intervalDays: 1,
    defaultDoseMg: 850,
    unit: "mg",
    peakDays: 0.15,
    steadyStateWeeks: 1,
    potencyFactor: 0.72,
    summary:
      "Biguanida de primeira linha no diabetes tipo 2 que reduz a produção hepática de glicose e melhora a sensibilidade periférica à insulina.",
    mechanism:
      "Atua principalmente no fígado reduzindo a gliconeogênese e a glicogenólise (via modulação energética mitocondrial/AMPK), além de melhorar a captação periférica de glicose e a ação intestinal.",
    studies:
      "Em estudos clássicos como o UKPDS, demonstrou redução consistente de complicações microvasculares e desfechos cardiovasculares em pacientes com diabetes tipo 2, com excelente perfil de segurança quando respeitada a função renal.",
    sideEffects: [
      "Desconforto gastrointestinal (gases, diarreia, náuseas) — mais comum na liberação imediata e reduzido com XR e ingestão junto às refeições",
      "Redução gradual dos níveis de vitamina B12 com uso prolongado",
    ],
    contraindications: [
      "Insuficiência renal grave (TFGe < 30 mL/min/1,73m²)",
      "Acidose metabólica aguda ou cetoacidose diabética",
    ],
    monitoring: ["Função renal (TFGe / creatinina)", "HbA1c e glicemia", "Vitamina B12 em uso crônico"],
    timelines: {
      early: "Semanas 1–2: Adaptação gastrointestinal; uso com refeições e formulação XR costuma melhorar a tolerância.",
      mid: "Semanas 4–8: Melhora progressiva do controle glicêmico e da sensibilidade insulínica.",
      late: "Semanas 12+: Controle de HbA1c e acompanhamento anual de função renal e vitamina B12.",
    },
  },
  {
    id: "sglt2",
    name: "Empagliflozina / Dapagliflozina",
    nicknames: ["Jardiance", "Forxiga"],
    category: "Metabolismo Glicídico, Lipídico & Cardiometabólico",
    route: "VO 1x/dia",
    halfLifeHours: 12,
    intervalDays: 1,
    defaultDoseMg: 10,
    unit: "mg",
    peakDays: 0.1,
    steadyStateWeeks: 1,
    potencyFactor: 0.78,
    summary:
      "Inibidores do cotransportador sódio-glicose 2 (SGLT2) no túbulo proximal renal, promovendo glicosúria e proteção cardiorrenal.",
    mechanism:
      "Bloqueiam a reabsorção renal de glicose e sódio via SGLT2, aumentando a excreção urinária de glicose (com leve perda calórica associada), reduzindo a pressão intraglomerular e modulando o equilíbrio hemodinâmico.",
    studies:
      "Nos ensaios EMPA-REG OUTCOME, DECLARE-TIMI 58, DAPA-HF e EMPEROR-Reduced, demonstraram redução de hospitalizações por insuficiência cardíaca, proteção renal progressiva e redução de risco cardiovascular.",
    sideEffects: [
      "Infecções fúngicas genitais e infecções do trato urinário",
      "Depleção volêmica leve, hipotensão postural ou sede aumentada",
      "Raro: cetoacidose euglicêmica em situações de estresse agudo, jejum prolongado ou restrição severa de carboidratos",
    ],
    contraindications: [
      "Hipersensibilidade ao fármaco ou situações de risco elevado para cetoacidose sem manejo médico",
    ],
    monitoring: ["TFGe e eletrólitos", "Pressão arterial e hidratação", "Higiene íntima e sinais de infecção"],
    timelines: {
      early: "Semanas 1–2: Início da glicosúria e ajuste hemodinâmico/diurético leve.",
      mid: "Semanas 4–8: Estabilização da TFGe inicial e melhora glicêmica/cardiorrenal.",
      late: "Semanas 12+: Benefício protetor cardiorrenal e metabólico de médio/longo prazo.",
    },
  },
  {
    id: "estatina",
    name: "Rosuvastatina / Atorvastatina",
    nicknames: ["Crestor", "Lipitor"],
    category: "Metabolismo Glicídico, Lipídico & Cardiometabólico",
    route: "VO 1x/dia",
    halfLifeHours: 19,
    intervalDays: 1,
    defaultDoseMg: 20,
    unit: "mg",
    peakDays: 0.2,
    steadyStateWeeks: 1,
    potencyFactor: 0.75,
    summary:
      "Inibidores da HMG-CoA redutase (estatinas) que reduzem a síntese hepática de colesterol e aumentam a captação de LDL-colesterol.",
    mechanism:
      "Inibem competitivamente a enzima limitante da biossíntese de colesterol no fígado, levando à maior expressão de receptores de LDL na superfície dos hepatócitos e queda acentuada do LDL circulante.",
    studies:
      "Extensa evidência clínica (incluindo JUPITER e metanálises CTT) comprova redução consistente de infarto, AVC e mortalidade cardiovascular proporcional à redução do LDL-colesterol.",
    sideEffects: [
      "Mialgia leve, dor articular, cefaleia ou elevação discreta de enzimas hepáticas em pequena parcela dos casos",
      "Raro: miopatia significativa ou rabdomiólise (atenção a dor muscular difusa intensa e escurecimento urinário)",
    ],
    contraindications: [
      "Doença hepática ativa não esclarecida, gestação e lactação",
    ],
    monitoring: ["Perfil lipídico (LDL, HDL, triglicerídeos)", "TGO/TGP e CK se houver sintomas musculares"],
    timelines: {
      early: "Semanas 1–2: Início rápido da queda do LDL-colesterol.",
      mid: "Semanas 4–8: Queda expressiva e próximo do platô lipídico para reavaliação laboratorial.",
      late: "Semanas 12+: Consolidação da redução de risco cardiovascular de longo prazo.",
    },
  },
  {
    id: "orlistate",
    name: "Orlistate",
    nicknames: ["Xenical"],
    category: "Metabolismo Glicídico, Lipídico & Cardiometabólico",
    route: "VO até 3x/dia às refeições com gordura",
    halfLifeHours: 2,
    intervalDays: 1,
    defaultDoseMg: 120,
    unit: "mg",
    peakDays: 0.1,
    steadyStateWeeks: 1,
    potencyFactor: 0.65,
    summary:
      "Inibidor seletivo e reversível das lipases gastrointestinais que reduz em cerca de ~30% a absorção da gordura dietética no trato digestivo.",
    mechanism:
      "Liga-se covalentemente ao sítio ativo das lipases gástrica e pancreática no lúmen intestinal, impedindo a hidrólise de triglicerídeos em ácidos graxos absorvíveis e aumentando sua eliminação nas fezes.",
    studies:
      "No estudo XENDOS (4 anos), associado a mudanças de estilo de vida, reduziu a incidência de diabetes tipo 2 e promoveu maior perda de peso sustentada em relação ao placebo.",
    sideEffects: [
      "Esteatorreia (fezes oleosas), flatulência com descarga oleosa, urgência fecal — diretamente proporcionais ao teor de gordura da refeição",
      "Redução potencial da absorção de vitaminas lipossolúveis (A, D, E, K) se não houver separação/suplementação adequada",
    ],
    contraindications: [
      "Síndrome de má absorção crônica, colestase, gestação ou lactação",
    ],
    monitoring: ["Aderência dietética ao teor de gordura por refeição", "Vitaminas lipossolúveis em uso prolongado"],
    timelines: {
      early: "Semanas 1–2: Efeito luminal imediato a cada refeição com gordura; resposta GI reflete o consumo lipídico.",
      mid: "Semanas 4–8: Ajuste alimentar prático para evitar desconfortos intestinais.",
      late: "Semanas 12+: Avaliação da perda ponderal acumulada e estado nutricional.",
    },
  },
];

const SKINFORLD_SITES = {
  peitoral: {
    id: "peitoral",
    label: "Peitoral / Peito",
    view: "frontal",
    x: 42,
    y: 33,
    protocol: "JP3 Masculino · JP7",
    angle: "Diagonal (ao longo da linha da axila ao mamilo)",
    location:
      "Na metade da distância entre a linha axilar anterior e o mamilo (no homem, ligeiramente acima; na mulher, no terço superior externo).",
    pinchGuide:
      "Pinçar com polegar e indicador a ~1 cm acima do ponto marcado, mantendo a prega inclinada na direção do mamilo e aplicando o adipômetro a ~1 cm de distância dos dedos.",
    commonMistake: "Puxar tecido mamário profundo ou medir na vertical em vez da diagonal.",
  },
  abdomen: {
    id: "abdomen",
    label: "Abdômen",
    view: "frontal",
    x: 46,
    y: 47,
    protocol: "JP3 Masculino · JP3 Feminino · JP7",
    angle: "Vertical ou Horizontal (conforme protocolo)",
    location:
      "A cerca de 2 cm (1 polegada) à direita da cicatriz umbilical, na altura do umbigo.",
    pinchGuide:
      "Pinçar a prega abdominal com firmeza, esperar 1 a 2 segundos para estabilização do ponteiro/visor e fazer a leitura sem soltar a pinça.",
    commonMistake: "Medir muito próximo ao umbigo (onde há cicatriz/tensão) ou sobre contração abdominal.",
  },
  coxa: {
    id: "coxa",
    label: "Coxa Anterior",
    view: "frontal",
    x: 43,
    y: 66,
    protocol: "JP3 Masculino · JP3 Feminino · JP7",
    angle: "Longitudinal (ao longo do eixo da coxa)",
    location:
      "Na linha média anterior da coxa, exatamente no ponto médio entre a prega inguinal e a borda superior da patela.",
    pinchGuide:
      "Com o peso corporal apoiado na perna oposta e joelho relaxado, levantar a prega longitudinalmente e aplicar o adipômetro no ponto médio.",
    commonMistake: "Medir com o quadríceps contraído ou apoiar o peso na perna avaliada.",
  },
  triceps: {
    id: "triceps",
    label: "Tríceps",
    view: "dorsal",
    x: 34,
    y: 35,
    protocol: "JP3 Feminino · JP7",
    angle: "Vertical (ao longo do eixo posterior do braço)",
    location:
      "Na face posterior do braço, no ponto médio exato entre o processo acromial (ombro) e o olécrano (cotovelo), com braço relaxado ao lado do corpo.",
    pinchGuide:
      "Pinçar verticalmente a dobra cutânea na parte posterior do braço, mantendo o cotovelo estendido e relaxado.",
    commonMistake: "Deslocar para a face lateral ou posterior-interna do braço.",
  },
  subescapular: {
    id: "subescapular",
    label: "Subescapular",
    view: "dorsal",
    x: 43,
    y: 36,
    protocol: "JP7",
    angle: "Diagonal (~45° seguindo as linhas naturais de clivagem da pele)",
    location:
      "1 a 2 cm abaixo do ângulo inferior da escápula (ponta inferior da omoplata), com o ombro e braço relaxados.",
    pinchGuide:
      "Acompanhar a inclinação natural descendente e lateral (cerca de 45°), pinçando a prega e aplicando o compasso logo abaixo dos dedos.",
    commonMistake: "Pedir para elevar o braço alto e puxar a escápula para fora do lugar durante a leitura.",
  },
  axilar_media: {
    id: "axilar_media",
    label: "Axilar Média",
    view: "frontal",
    x: 35,
    y: 38,
    protocol: "JP7",
    angle: "Vertical",
    location:
      "Na linha axilar média, na altura do apêndice xifoide (final do esterno), com o braço levemente abduzido para facilitar o acesso.",
    pinchGuide:
      "Pinçar verticalmente na linha média da axila na altura do xifoide e ler após 1–2 segundos.",
    commonMistake: "Subir demais para o cavo axilar ou ir muito para trás (linha escapular).",
  },
  suprailiaca: {
    id: "suprailiaca",
    label: "Suprailíaca",
    view: "dorsal",
    x: 38,
    y: 46,
    protocol: "JP3 Feminino · JP7",
    angle: "Diagonal (acompanhando a crista ilíaca anterior/lateral)",
    location:
      "Logo acima da crista ilíaca, na linha axilar anterior/média, seguindo a inclinação natural da crista.",
    pinchGuide:
      "Pinçar a dobra diagonalmente logo acima da borda superior do osso ilíaco e aplicar o adipômetro sem inclinar o aparelho.",
    commonMistake: "Confundir com a prega abdominal lateral ou comprimir excessivamente a pele.",
  },
};

function calculateBodyFatFromFolds({ protocol, sex, age, folds }) {
  const n = (k) => Math.max(0, Number(folds[k]) || 0);
  let sum = 0;
  let bodyDensity = 1.05;

  if (protocol === "jp3") {
    if (sex === "male") {
      sum = n("peitoral") + n("abdomen") + n("coxa");
      bodyDensity =
        1.10938 -
        0.0008267 * sum +
        0.0000016 * sum * sum -
        0.0002574 * (Number(age) || 30);
    } else {
      sum = n("triceps") + n("suprailiaca") + n("coxa");
      bodyDensity =
        1.0994921 -
        0.0009929 * sum +
        0.0000023 * sum * sum -
        0.0001392 * (Number(age) || 30);
    }
  } else {
    sum =
      n("peitoral") +
      n("axilar_media") +
      n("triceps") +
      n("subescapular") +
      n("abdomen") +
      n("suprailiaca") +
      n("coxa");
    const safeAge = Number(age) || 30;
    if (sex === "male") {
      bodyDensity =
        1.112 -
        0.00043499 * sum +
        0.00000055 * sum * sum -
        0.00028826 * safeAge;
    } else {
      bodyDensity =
        1.097 -
        0.00046971 * sum +
        0.00000056 * sum * sum -
        0.00012828 * safeAge;
    }
  }

  const clampedDensity = Math.max(0.98, Math.min(1.15, bodyDensity));
  const bodyFatPct = Math.max(3, Math.min(55, 495 / clampedDensity - 450));

  return {
    sumMm: Number(sum.toFixed(1)),
    density: Number(clampedDensity.toFixed(4)),
    bodyFatPct: Number(bodyFatPct.toFixed(1)),
  };
}

function simulateConcentrationAtDay(drug, doseMg, intervalDays, day) {
  const halfLifeDays = Math.max(0.08, (drug.halfLifeHours || 24) / 24);
  const k = Math.LN2 / halfLifeDays;
  const interval = Math.max(1, Number(intervalDays) || drug.intervalDays || 7);
  const dose = Math.max(0, Number(doseMg) || drug.defaultDoseMg || 1);
  const peak = Math.max(0.05, Number(drug.peakDays) || 1);

  let total = 0;
  for (let t0 = 0; t0 <= day; t0 += interval) {
    const dt = day - t0;
    const elimination = Math.exp(-k * dt);
    const absorptionRamp = 1 - Math.exp(-dt / peak);
    total += dose * absorptionRamp * elimination;
  }

  const maxSingleDosePeak = dose * (1 - Math.exp(-peak / peak)) * Math.exp(-k * peak);
  const normalizedLevel = maxSingleDosePeak > 0 ? (total / maxSingleDosePeak) * 50 : 0;
  return Math.min(100, Number(normalizedLevel.toFixed(1)));
}

const INITIAL_PROFILES = [
  {
    id: "p1",
    name: "Perfil Clínico Principal",
    sex: "male",
    age: 32,
    heightCm: 178,
    weightKg: 82.4,
    targetWeightKg: 78.0,
    activityMultiplier: 1.55,
    goalMode: "recomp",
    refeedDays: [3, 6],
    refeedDeltaKcal: 450,
    macrosSplit: { pPerKg: 2.2, gPerKg: 0.8 },
    measurements: {
      neck: 39,
      chest: 102,
      waist: 81,
      abdomen: 84,
      hips: 97,
      rightArm: 37.5,
      rightThigh: 59,
      calf: 37,
    },
    caliper: {
      protocol: "jp3",
      folds: {
        peitoral: 9,
        abdomen: 17,
        coxa: 12,
        triceps: 8,
        subescapular: 12,
        axilar_media: 10,
        suprailiaca: 13,
      },
      lastBodyFatPct: 14.2,
      lastDensity: 1.0661,
      lastSumMm: 38,
    },
    history: [
      { id: "h1", date: "2026-10-20", weightKg: 84.2, bodyFatPct: 15.8, waistCm: 83.5, note: "Avaliação inicial" },
      { id: "h2", date: "2026-11-03", weightKg: 83.3, bodyFatPct: 14.9, waistCm: 82.2, note: "Ajuste proteico e treino" },
      { id: "h3", date: "2026-11-17", weightKg: 82.4, bodyFatPct: 14.2, waistCm: 81.0, note: "Leitura adipômetro sincronizada" },
    ],
    mealPlan: [
      { id: "m1", title: "Café da Manhã", items: [{ foodId: "f2", grams: 150 }, { foodId: "f13", grams: 40 }, { foodId: "f7", grams: 170 }] },
      { id: "m2", title: "Almoço", items: [{ foodId: "f1", grams: 160 }, { foodId: "f11", grams: 180 }, { foodId: "f17", grams: 10 }] },
      { id: "m3", title: "Lanche / Pré-Treino", items: [{ foodId: "f6", grams: 30 }, { foodId: "f14", grams: 80 }, { foodId: "f15", grams: 20 }] },
      { id: "m4", title: "Jantar", items: [{ foodId: "f5", grams: 170 }, { foodId: "f10", grams: 200 }, { foodId: "f16", grams: 20 }] },
    ],
    activeDrugs: [
      {
        uid: "d1",
        drugId: "semaglutida",
        doseMg: 0.5,
        intervalDays: 7,
        startDayOffset: 0,
        enabled: true,
      },
    ],
  },
];

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function App() {
  const saved = useMemo(() => loadSavedState(), []);

  const [profiles, setProfiles] = useState(saved?.profiles || INITIAL_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState(saved?.activeProfileId || "p1");
  const [foods, setFoods] = useState(saved?.foods || DEFAULT_FOODS);

  const [mainModule, setMainModule] = useState(saved?.mainModule || "overview");
  const [subTab, setSubTab] = useState({
    overview: "integrated",
    nutrition: "cycle",
    anthropometry: "caliper",
    clinical: "encyclopedia",
  });

  const [selectedSiteId, setSelectedSiteId] = useState("peitoral");
  const [anatomyView, setAnatomyView] = useState("frontal");
  const [caliperNote, setCaliperNote] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const [drugSearch, setDrugSearch] = useState("");
  const [drugCategoryFilter, setDrugCategoryFilter] = useState("Todos");
  const [selectedDrugId, setSelectedDrugId] = useState("semaglutida");
  const [simHorizonDays, setSimHorizonDays] = useState(56);

  const [equivSourceId, setEquivSourceId] = useState("f11");
  const [equivTargetId, setEquivTargetId] = useState("f10");
  const [equivSourceGrams, setEquivSourceGrams] = useState(150);

  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeProfileId) || profiles[0],
    [profiles, activeProfileId]
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          profiles,
          activeProfileId,
          foods,
          mainModule,
        })
      );
    } catch {
      // ignora erro de cota local
    }
  }, [profiles, activeProfileId, foods, mainModule]);

  const notify = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2800);
  };

  const updateActiveProfile = (updater) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== activeProfile.id) return p;
        return typeof updater === "function" ? updater(p) : { ...p, ...updater };
      })
    );
  };

  const setActiveSubTab = (tabName) => {
    setSubTab((prev) => ({ ...prev, [mainModule]: tabName }));
  };

  const handleSelectMainModule = (modKey, defaultSub) => {
    setMainModule(modKey);
    if (defaultSub) {
      setSubTab((prev) => ({ ...prev, [modKey]: defaultSub }));
    }
  };

  const bmrKcal = useMemo(() => {
    const w = Number(activeProfile.weightKg) || 75;
    const h = Number(activeProfile.heightCm) || 175;
    const a = Number(activeProfile.age) || 30;
    const base = 10 * w + 6.25 * h - 5 * a;
    return Math.round(activeProfile.sex === "male" ? base + 5 : base - 161);
  }, [activeProfile]);

  const tdeeKcal = useMemo(() => {
    return Math.round(bmrKcal * (Number(activeProfile.activityMultiplier) || 1.55));
  }, [bmrKcal, activeProfile.activityMultiplier]);

  const goalAdjustmentKcal = useMemo(() => {
    if (activeProfile.goalMode === "cut") return -450;
    if (activeProfile.goalMode === "bulk") return 350;
    return -150;
  }, [activeProfile.goalMode]);

  const todayDayOfWeek = new Date().getDay();
  const isTodayRefeed = Array.isArray(activeProfile.refeedDays)
    ? activeProfile.refeedDays.includes(todayDayOfWeek)
    : false;

  const targetKcalToday = useMemo(() => {
    const baseTarget = tdeeKcal + goalAdjustmentKcal;
    const refeedBonus = isTodayRefeed ? Number(activeProfile.refeedDeltaKcal) || 400 : 0;
    return Math.max(1200, Math.round(baseTarget + refeedBonus));
  }, [tdeeKcal, goalAdjustmentKcal, isTodayRefeed, activeProfile.refeedDeltaKcal]);

  const macroTargets = useMemo(() => {
    const w = Number(activeProfile.weightKg) || 75;
    const proteinGrams = Math.round(w * (Number(activeProfile.macrosSplit?.pPerKg) || 2.0));
    const fatGrams = Math.round(w * (Number(activeProfile.macrosSplit?.gPerKg) || 0.8));
    const usedKcal = proteinGrams * 4 + fatGrams * 9;
    const carbGrams = Math.max(20, Math.round((targetKcalToday - usedKcal) / 4));
    return { proteinGrams, carbGrams, fatGrams };
  }, [activeProfile.weightKg, activeProfile.macrosSplit, targetKcalToday]);

  const mealTotals = useMemo(() => {
    const foodMap = new Map(foods.map((f) => [f.id, f]));
    let kcal = 0;
    let p = 0;
    let c = 0;
    let g = 0;

    (activeProfile.mealPlan || []).forEach((meal) => {
      (meal.items || []).forEach((item) => {
        const food = foodMap.get(item.foodId);
        if (!food) return;
        const factor = (Number(item.grams) || 0) / 100;
        kcal += food.kcal * factor;
        p += food.p * factor;
        c += food.c * factor;
        g += food.g * factor;
      });
    });

    return {
      kcal: Math.round(kcal),
      p: Number(p.toFixed(1)),
      c: Number(c.toFixed(1)),
      g: Number(g.toFixed(1)),
    };
  }, [foods, activeProfile.mealPlan]);

  const caliperResult = useMemo(() => {
    return calculateBodyFatFromFolds({
      protocol: activeProfile.caliper?.protocol || "jp3",
      sex: activeProfile.sex,
      age: activeProfile.age,
      folds: activeProfile.caliper?.folds || {},
    });
  }, [activeProfile.caliper, activeProfile.sex, activeProfile.age]);

  const bodyCompositionSummary = useMemo(() => {
    const weight = Number(activeProfile.weightKg) || 0;
    const bfPct = Number(activeProfile.caliper?.lastBodyFatPct ?? caliperResult.bodyFatPct) || 0;
    const fatKg = Number(((weight * bfPct) / 100).toFixed(1));
    const leanKg = Number(Math.max(0, weight - fatKg).toFixed(1));
    return { weight, bfPct, fatKg, leanKg };
  }, [activeProfile.weightKg, activeProfile.caliper?.lastBodyFatPct, caliperResult.bodyFatPct]);

  const filteredDrugs = useMemo(() => {
    const q = drugSearch.trim().toLowerCase();
    return DRUG_CATALOG.filter((d) => {
      const matchesCat = drugCategoryFilter === "Todos" || d.category === drugCategoryFilter;
      if (!matchesCat) return false;
      if (!q) return true;
      const inName = d.name.toLowerCase().includes(q);
      const inNick = (d.nicknames || []).some((n) => n.toLowerCase().includes(q));
      const inSum = d.summary.toLowerCase().includes(q);
      return inName || inNick || inSum;
    });
  }, [drugSearch, drugCategoryFilter]);

  const selectedDrug = useMemo(() => {
    return DRUG_CATALOG.find((d) => d.id === selectedDrugId) || DRUG_CATALOG[0];
  }, [selectedDrugId]);

  const simulationSeries = useMemo(() => {
    const days = Array.from({ length: simHorizonDays + 1 }, (_, i) => i);
    const activeList = (activeProfile.activeDrugs || []).filter((item) => item.enabled);

    return days.map((day) => {
      let combined = 0;
      activeList.forEach((entry) => {
        const catalogDrug = DRUG_CATALOG.find((d) => d.id === entry.drugId);
        if (!catalogDrug) return;
        const offset = Number(entry.startDayOffset) || 0;
        const effectiveDay = Math.max(0, day - offset);
        const val = simulateConcentrationAtDay(
          catalogDrug,
          entry.doseMg,
          entry.intervalDays || catalogDrug.intervalDays,
          effectiveDay
        );
        combined += val * (catalogDrug.potencyFactor || 1);
      });
      return {
        day,
        level: Math.min(100, Number(combined.toFixed(1))),
      };
    });
  }, [simHorizonDays, activeProfile.activeDrugs]);

  const currentPkLevel = useMemo(() => {
    const activeList = (activeProfile.activeDrugs || []).filter((item) => item.enabled);
    if (!activeList.length) return 0;
    let sum = 0;
    activeList.forEach((entry) => {
      const catalogDrug = DRUG_CATALOG.find((d) => d.id === entry.drugId);
      if (!catalogDrug) return;
      sum +=
        simulateConcentrationAtDay(
          catalogDrug,
          entry.doseMg,
          entry.intervalDays || catalogDrug.intervalDays,
          14
        ) * (catalogDrug.potencyFactor || 1);
    });
    return Math.min(100, Number(sum.toFixed(1)));
  }, [activeProfile.activeDrugs]);

  const handleSaveCaliperAssessment = () => {
    const todayIso = new Date().toISOString().slice(0, 10);
    const weight = Number(activeProfile.weightKg) || 0;
    const bf = caliperResult.bodyFatPct;
    const waist = Number(activeProfile.measurements?.waist) || null;

    updateActiveProfile((prev) => {
      const nextHistory = [
        ...(prev.history || []),
        {
          id: `h_${Date.now()}`,
          date: todayIso,
          weightKg: weight,
          bodyFatPct: bf,
          waistCm: waist,
          note:
            caliperNote.trim() ||
            `Adipômetro (${(prev.caliper?.protocol || "jp3").toUpperCase()}) · Σ ${caliperResult.sumMm} mm`,
        },
      ];
      return {
        ...prev,
        caliper: {
          ...prev.caliper,
          lastBodyFatPct: bf,
          lastDensity: caliperResult.density,
          lastSumMm: caliperResult.sumMm,
        },
        history: nextHistory,
      };
    });

    setCaliperNote("");
    notify("Avaliação do adipômetro salva e integrada ao histórico!");
  };

  const handleSendDrugToSimulator = (drug) => {
    const exists = (activeProfile.activeDrugs || []).some((d) => d.drugId === drug.id);
    if (!exists) {
      updateActiveProfile((prev) => ({
        ...prev,
        activeDrugs: [
          ...(prev.activeDrugs || []),
          {
            uid: `d_${Date.now()}`,
            drugId: drug.id,
            doseMg: drug.defaultDoseMg,
            intervalDays: drug.intervalDays,
            startDayOffset: 0,
            enabled: true,
          },
        ],
      }));
    }
    setMainModule("clinical");
    setSubTab((prev) => ({ ...prev, clinical: "simulator" }));
    notify(`${drug.name} enviado ao simulador PK/PD.`);
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify({ profiles, activeProfileId, foods }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexusprotocol-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify("Backup JSON exportado.");
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "{}"));
        if (Array.isArray(parsed.profiles) && parsed.profiles.length) {
          setProfiles(parsed.profiles);
          setActiveProfileId(parsed.activeProfileId || parsed.profiles[0].id);
          if (Array.isArray(parsed.foods)) setFoods(parsed.foods);
          notify("Dados restaurados do backup JSON!");
        } else {
          notify("Arquivo JSON sem perfis válidos.");
        }
      } catch {
        notify("Erro ao ler arquivo JSON.");
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfiles(INITIAL_PROFILES);
    setActiveProfileId("p1");
    setFoods(DEFAULT_FOODS);
    notify("Dados restaurados para o padrão inicial.");
  };

  const equivalenceResult = useMemo(() => {
    const src = foods.find((f) => f.id === equivSourceId) || foods[0];
    const dst = foods.find((f) => f.id === equivTargetId) || foods[1] || foods[0];
    const grams = Math.max(0, Number(equivSourceGrams) || 0);
    const srcKcal = (src.kcal * grams) / 100;
    const dstGramsForKcal = dst.kcal > 0 ? Math.round((srcKcal / dst.kcal) * 100) : 0;

    const srcCarbs = (src.c * grams) / 100;
    const dstGramsForCarbs = dst.c > 0 ? Math.round((srcCarbs / dst.c) * 100) : 0;

    const srcProt = (src.p * grams) / 100;
    const dstGramsForProt = dst.p > 0 ? Math.round((srcProt / dst.p) * 100) : 0;

    return {
      src,
      dst,
      grams,
      srcKcal: Math.round(srcKcal),
      dstGramsForKcal,
      srcCarbs: Number(srcCarbs.toFixed(1)),
      dstGramsForCarbs,
      srcProt: Number(srcProt.toFixed(1)),
      dstGramsForProt,
    };
  }, [foods, equivSourceId, equivTargetId, equivSourceGrams]);

  const activeSubTab = subTab[mainModule];
  const visibleSites = useMemo(
    () => Object.values(SKINFORLD_SITES).filter((s) => s.view === anatomyView),
    [anatomyView]
  );
  const selectedSite = SKINFORLD_SITES[selectedSiteId] || SKINFORLD_SITES.peitoral;

  const mainModules = [
    { id: "overview", label: "Visão Integrada", icon: Layers, defaultSub: "integrated" },
    { id: "nutrition", label: "Nutrição & Dieta", icon: Utensils, defaultSub: "cycle" },
    { id: "anthropometry", label: "Medidas & Adipômetro", icon: Ruler, defaultSub: "caliper" },
    { id: "clinical", label: "Clínica & Fármacos", icon: Pill, defaultSub: "encyclopedia" },
  ];

  const subTabsByModule = {
    overview: [
      { id: "integrated", label: "Painel Integrado & Evolução" },
      { id: "backup", label: "Perfis & Backup JSON" },
    ],
    nutrition: [
      { id: "cycle", label: "Ciclo Calórico & Refeed" },
      { id: "mealplan", label: "Cardápio Personalizado" },
      { id: "equivalence", label: "Equivalência Alimentar" },
    ],
    anthropometry: [
      { id: "caliper", label: "Adipômetro & Mapa Anatômico" },
      { id: "body", label: "Peso, Massa Magra & Medidas" },
    ],
    clinical: [
      { id: "encyclopedia", label: "Bulário & Estudos Clínicos" },
      { id: "simulator", label: "Simulador PK/PD" },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071936] via-[#051024] to-[#030812] text-slate-100 pb-14">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-[#071D3F]/95 px-4 py-3 text-sm font-medium text-cyan-100 shadow-xl backdrop-blur">
          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <header className="sticky top-0 z-30 border-b border-cyan-500/15 bg-[#040C1B]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-300 shadow-inner">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">NexusProtocol</h1>
                <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-[11px] font-semibold text-cyan-300">
                  PWA Clínico
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Integração Metabólica, Antropometria & Farmacocinética
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-slate-700/70 bg-slate-900/80 px-3 py-1.5 text-xs">
              <User className="h-3.5 w-3.5 text-cyan-400" />
              <select
                value={activeProfile.id}
                onChange={(e) => setActiveProfileId(e.target.value)}
                className="bg-transparent text-slate-100 focus:outline-none"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleExportJson}
              title="Exportar JSON"
              className="flex items-center gap-1.5 rounded-xl border border-slate-700/70 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-cyan-400/40 hover:text-cyan-200 transition"
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Backup</span>
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto no-scrollbar px-4 pb-2.5">
          {mainModules.map((mod) => {
            const Icon = mod.icon;
            const active = mainModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => handleSelectMainModule(mod.id, mod.defaultSub)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  active
                    ? "border border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-sky-500/15 text-cyan-200 shadow-sm"
                    : "border border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-cyan-300" : "text-slate-500"}`} />
                <span>{mod.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-800/80 bg-[#030A17]/90">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto no-scrollbar px-4 py-2">
            {(subTabsByModule[mainModule] || []).map((tab) => {
              const isSubActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    isSubActive
                      ? "bg-cyan-400/15 text-cyan-300 border border-cyan-400/40"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 pt-6">
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-cyan-500/15 bg-slate-900/65 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Peso Atual</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {bodyCompositionSummary.weight} <span className="text-sm font-normal text-slate-400">kg</span>
            </p>
            <p className="mt-1 text-xs text-cyan-300">
              Meta: {activeProfile.targetWeightKg} kg
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/15 bg-slate-900/65 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">% Gordura (Adipômetro)</p>
            <p className="mt-1 text-2xl font-bold text-cyan-300">
              {bodyCompositionSummary.bfPct}%
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Massa magra: <span className="text-slate-200 font-medium">{bodyCompositionSummary.leanKg} kg</span>
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/15 bg-slate-900/65 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Meta Calórica Hoje</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {targetKcalToday} <span className="text-sm font-normal text-slate-400">kcal</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {isTodayRefeed ? (
                <span className="text-amber-300 font-medium">Dia de Refeed ativo</span>
              ) : (
                <span>Dieta: {mealTotals.kcal} kcal</span>
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/15 bg-slate-900/65 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Exposição PK Estimada</p>
            <p className="mt-1 text-2xl font-bold text-emerald-300">
              {currentPkLevel}%
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {(activeProfile.activeDrugs || []).filter((d) => d.enabled).length} agente(s) ativo(s)
            </p>
          </div>
        </section>

        {mainModule === "overview" && activeSubTab === "integrated" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/65 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-cyan-400" />
                    Cruzamento Longitudinal: Peso, % Gordura Real & Protocolo
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cada avaliação salva no Adipômetro atualiza automaticamente a % de gordura e a linha do tempo integrada.
                  </p>
                </div>
                <button
                  onClick={() => handleSelectMainModule("anthropometry", "caliper")}
                  className="flex items-center gap-1 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/20 transition"
                >
                  <span>Nova medição no Adipômetro</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-5 overflow-x-auto">
                <svg viewBox="0 0 700 220" className="w-full min-w-[520px] rounded-xl bg-[#040C1B] p-3 border border-slate-800">
                  <line x1="50" y1="180" x2="670" y2="180" stroke="#1e293b" strokeWidth="1" />
                  <line x1="50" y1="30" x2="50" y2="180" stroke="#1e293b" strokeWidth="1" />

                  {(() => {
                    const hist = activeProfile.history || [];
                    if (!hist.length) return null;
                    const maxW = Math.max(...hist.map((h) => Number(h.weightKg) || 80), 90);
                    const minW = Math.min(...hist.map((h) => Number(h.weightKg) || 70), 60);
                    const spanW = Math.max(5, maxW - minW);

                    const ptsWeight = hist.map((h, idx) => {
                      const x = hist.length === 1 ? 360 : 70 + (idx * 570) / (hist.length - 1);
                      const y = 170 - ((Number(h.weightKg) - minW) / spanW) * 125;
                      return { x, y, item: h };
                    });

                    const ptsBf = hist
                      .filter((h) => typeof h.bodyFatPct === "number" && !Number.isNaN(h.bodyFatPct))
                      .map((h, idx, arr) => {
                        const x = arr.length === 1 ? 360 : 70 + (idx * 570) / (arr.length - 1);
                        const y = 170 - Math.min(1, Math.max(0, Number(h.bodyFatPct) / 40)) * 125;
                        return { x, y, bf: h.bodyFatPct };
                      });

                    const polyWeight = ptsWeight.map((p) => `${p.x},${p.y}`).join(" ");
                    const polyBf = ptsBf.map((p) => `${p.x},${p.y}`).join(" ");

                    return (
                      <>
                        {ptsBf.length > 1 && (
                          <polyline
                            fill="none"
                            stroke="#22d3ee"
                            strokeWidth="2.5"
                            strokeDasharray="5 4"
                            points={polyBf}
                          />
                        )}
                        {ptsWeight.length > 1 && (
                          <polyline
                            fill="none"
                            stroke="#34d399"
                            strokeWidth="3"
                            points={polyWeight}
                          />
                        )}
                        {ptsWeight.map((p, i) => (
                          <g key={p.item.id || i}>
                            <circle cx={p.x} cy={p.y} r="5" fill="#34d399" />
                            <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#a7f3d0" fontSize="11">
                              {p.item.weightKg}kg
                            </text>
                            <text x={p.x} y="198" textAnchor="middle" fill="#94a3b8" fontSize="10">
                              {String(p.item.date || "").slice(5)}
                            </text>
                          </g>
                        ))}
                        {ptsBf.map((p, i) => (
                          <g key={`bf-${i}`}>
                            <circle cx={p.x} cy={p.y} r="4.5" fill="#22d3ee" />
                            <text x={p.x} y={p.y + 16} textAnchor="middle" fill="#67e8f9" fontSize="10">
                              {p.bf}% BF
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>

              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Peso Corporal (kg)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> % Gordura Estimado/Adipômetro
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-sm font-bold text-white mb-3">Registro Cronológico Integrado</h3>
              <div className="divide-y divide-slate-800/80">
                {[...(activeProfile.history || [])].reverse().map((entry) => (
                  <div key={entry.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-xs">
                    <div>
                      <p className="font-semibold text-slate-100">{entry.note || "Registro clínico"}</p>
                      <p className="text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3 text-cyan-400" /> {entry.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-emerald-300 font-semibold">
                        {entry.weightKg} kg
                      </span>
                      {typeof entry.bodyFatPct === "number" && (
                        <span className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 text-cyan-300 font-semibold">
                          {entry.bodyFatPct}% BF
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {mainModule === "overview" && activeSubTab === "backup" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/65 p-5 space-y-4">
            <h2 className="text-base font-bold text-white">Gerenciamento de Dados, Perfis & Backup</h2>
            <p className="text-xs text-slate-400">
              Todos os dados são salvos automaticamente no navegador deste dispositivo. Use o backup JSON para transferir ou arquivar avaliações.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportJson}
                className="flex items-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 px-4 py-2.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/30 transition"
              >
                <Download className="h-4 w-4" /> Baixar Backup (.json)
              </button>

              <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-cyan-400/40 transition">
                <Upload className="h-4 w-4 text-cyan-400" /> Importar Backup (.json)
                <input type="file" accept="application/json" onChange={handleImportJson} className="hidden" />
              </label>

              <button
                onClick={handleResetDemo}
                className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 px-4 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition"
              >
                <RotateCcw className="h-4 w-4" /> Restaurar Padrão Inicial
              </button>
            </div>
          </div>
        )}

        {mainModule === "nutrition" && activeSubTab === "cycle" && (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/65 p-5 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-cyan-400" /> Parâmetros Metabólicos & Ciclo Calórico
              </h2>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <label className="space-y-1">
                  <span className="text-slate-400">Peso (kg)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={activeProfile.weightKg}
                    onChange={(e) => updateActiveProfile({ weightKg: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-slate-400">Altura (cm)</span>
                  <input
                    type="number"
                    value={activeProfile.heightCm}
                    onChange={(e) => updateActiveProfile({ heightCm: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-slate-400">Idade</span>
                  <input
                    type="number"
                    value={activeProfile.age}
                    onChange={(e) => updateActiveProfile({ age: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-slate-400">Estratégia</span>
                  <select
                    value={activeProfile.goalMode}
                    onChange={(e) => updateActiveProfile({ goalMode: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  >
                    <option value="cut">Déficit / Cutting (-450 kcal)</option>
                    <option value="recomp">Recomposição (-150 kcal)</option>
                    <option value="bulk">Superávit / Ganho (+350 kcal)</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/65 p-5 space-y-3">
              <h2 className="text-base font-bold text-white">Metas Calculadas para Hoje</h2>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800">
                  <p className="text-slate-400">TMB Estimada</p>
                  <p className="text-lg font-bold text-white mt-0.5">{bmrKcal} kcal</p>
                </div>
                <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800">
                  <p className="text-slate-400">GET (Atividade)</p>
                  <p className="text-lg font-bold text-cyan-300 mt-0.5">{tdeeKcal} kcal</p>
                </div>
              </div>
              <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-4">
                <p className="text-xs text-cyan-200 font-semibold">Alvo Diário ({isTodayRefeed ? "Com Refeed" : "Dia Base"})</p>
                <p className="text-2xl font-bold text-white mt-1">{targetKcalToday} kcal</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-200">
                  <span>Proteína: <strong>{macroTargets.proteinGrams}g</strong></span>
                  <span>Carboidratos: <strong>{macroTargets.carbGrams}g</strong></span>
                  <span>Gorduras: <strong>{macroTargets.fatGrams}g</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {mainModule === "nutrition" && activeSubTab === "mealplan" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/65 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold text-white">Cardápio Estruturado</h2>
              <div className="text-xs text-cyan-300 font-semibold">
                Total Planejado: {mealTotals.kcal} kcal · P {mealTotals.p}g · C {mealTotals.c}g · G {mealTotals.g}g
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {(activeProfile.mealPlan || []).map((meal) => (
                <div key={meal.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                  <h3 className="text-sm font-bold text-cyan-200">{meal.title}</h3>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {(meal.items || []).map((it, idx) => {
                      const f = foods.find((x) => x.id === it.foodId);
                      if (!f) return null;
                      const kcalItem = Math.round((f.kcal * it.grams) / 100);
                      return (
                        <li key={idx} className="flex items-center justify-between border-b border-slate-900 pb-1">
                          <span>{f.name} ({it.grams}g)</span>
                          <span className="text-slate-400">{kcalItem} kcal</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {mainModule === "nutrition" && activeSubTab === "equivalence" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/65 p-5 space-y-4">
            <h2 className="text-base font-bold text-white">Calculadora de Equivalência Alimentar</h2>
            <div className="grid gap-3 sm:grid-cols-3 text-xs">
              <label className="space-y-1">
                <span className="text-slate-400">Alimento de Origem</span>
                <select
                  value={equivSourceId}
                  onChange={(e) => setEquivSourceId(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                >
                  {foods.map((f) => (
                    <option key={f.id} value={f.id} className="bg-slate-900">{f.name}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-slate-400">Quantidade Origem (g/ml)</span>
                <input
                  type="number"
                  value={equivSourceGrams}
                  onChange={(e) => setEquivSourceGrams(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                />
              </label>

              <label className="space-y-1">
                <span className="text-slate-400">Substituir Por</span>
                <select
                  value={equivTargetId}
                  onChange={(e) => setEquivTargetId(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                >
                  {foods.map((f) => (
                    <option key={f.id} value={f.id} className="bg-slate-900">{f.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 pt-2 text-xs">
              <div className="rounded-xl border border-cyan-500/25 bg-slate-950 p-3.5">
                <p className="text-slate-400">Equivalência Calórica ({equivalenceResult.srcKcal} kcal)</p>
                <p className="text-xl font-bold text-cyan-300 mt-1">{equivalenceResult.dstGramsForKcal} g</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                <p className="text-slate-400">Equivalência em Carboidratos ({equivalenceResult.srcCarbs}g)</p>
                <p className="text-xl font-bold text-white mt-1">{equivalenceResult.dstGramsForCarbs} g</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                <p className="text-slate-400">Equivalência em Proteínas ({equivalenceResult.srcProt}g)</p>
                <p className="text-xl font-bold text-emerald-300 mt-1">{equivalenceResult.dstGramsForProt} g</p>
              </div>
            </div>
          </div>
        )}

        {mainModule === "anthropometry" && activeSubTab === "caliper" && (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5 rounded-2xl border border-cyan-500/20 bg-slate-900/65 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Mapa Anatômico das Pregas</h2>
                  <p className="text-xs text-slate-400">Toque em um ponto para ver o guia técnico</p>
                </div>
                <div className="flex rounded-xl border border-slate-700 bg-slate-950 p-0.5 text-xs">
                  <button
                    onClick={() => setAnatomyView("frontal")}
                    className={`rounded-lg px-2.5 py-1 font-medium ${
                      anatomyView === "frontal" ? "bg-cyan-500/20 text-cyan-200" : "text-slate-400"
                    }`}
                  >
                    Frente
                  </button>
                  <button
                    onClick={() => setAnatomyView("dorsal")}
                    className={`rounded-lg px-2.5 py-1 font-medium ${
                      anatomyView === "dorsal" ? "bg-cyan-500/20 text-cyan-200" : "text-slate-400"
                    }`}
                  >
                    Costas
                  </button>
                </div>
              </div>

              <div className="relative mx-auto max-w-[270px] rounded-2xl border border-slate-800 bg-[#040C1B] p-3">
                <svg viewBox="0 0 100 100" className="w-full h-72">
                  <circle cx="50" cy="14" r="7" fill="#0f294a" stroke="#22d3ee" strokeWidth="1.2" />
                  <path
                    d="M32 25 Q50 21 68 25 L72 52 L60 54 L58 92 L46 92 L45 58 L39 92 L27 92 L29 52 Z"
                    fill="#0b1e38"
                    stroke="#38bdf8"
                    strokeOpacity="0.45"
                    strokeWidth="1.2"
                  />
                  {visibleSites.map((site) => {
                    const isSelected = selectedSite.id === site.id;
                    return (
                      <g
                        key={site.id}
                        onClick={() => setSelectedSiteId(site.id)}
                        className="cursor-pointer"
                      >
                        <circle
                          cx={site.x}
                          cy={site.y}
                          r={isSelected ? 4.8 : 3.5}
                          fill={isSelected ? "#22d3ee" : "#0284c7"}
                          stroke="#ffffff"
                          strokeWidth="1"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="rounded-xl border border-cyan-500/20 bg-slate-950/80 p-3.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 text-sm">{selectedSite.label}</span>
                  <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-[11px] text-cyan-200">
                    {selectedSite.protocol}
                  </span>
                </div>
                <p className="text-slate-300"><strong>Eixo:</strong> {selectedSite.angle}</p>
                <p className="text-slate-400"><strong>Localização:</strong> {selectedSite.location}</p>
                <p className="text-slate-300"><strong>Pinçamento:</strong> {selectedSite.pinchGuide}</p>
                <p className="text-amber-300/90"><strong>Evitar:</strong> {selectedSite.commonMistake}</p>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/65 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-white">Calculadora de Adipômetro (Jackson & Pollock + Siri)</h2>
                  <p className="text-xs text-slate-400">Insira as medidas em milímetros (mm)</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <select
                    value={activeProfile.caliper?.protocol || "jp3"}
                    onChange={(e) =>
                      updateActiveProfile((prev) => ({
                        ...prev,
                        caliper: { ...prev.caliper, protocol: e.target.value },
                      }))
                    }
                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-white"
                  >
                    <option value="jp3">3 Dobras (JP3)</option>
                    <option value="jp7">7 Dobras (JP7)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {Object.values(SKINFORLD_SITES).map((site) => {
                  const val = activeProfile.caliper?.folds?.[site.id] ?? "";
                  return (
                    <label
                      key={site.id}
                      onClick={() => setSelectedSiteId(site.id)}
                      className={`rounded-xl border p-3 space-y-1 transition cursor-pointer ${
                        selectedSite.id === site.id
                          ? "border-cyan-400/50 bg-cyan-500/10"
                          : "border-slate-800 bg-slate-950/70"
                      }`}
                    >
                      <span className="text-slate-300 font-medium block">{site.label} (mm)</span>
                      <input
                        type="number"
                        step="0.5"
                        value={val}
                        onChange={(e) => {
                          const nextMm = e.target.value === "" ? "" : Number(e.target.value);
                          updateActiveProfile((prev) => ({
                            ...prev,
                            caliper: {
                              ...prev.caliper,
                              folds: {
                                ...(prev.caliper?.folds || {}),
                                [site.id]: nextMm,
                              },
                            },
                          }));
                        }}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-white"
                      />
                    </label>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-3 rounded-xl border border-cyan-500/20 bg-slate-950 p-4 text-center">
                <div>
                  <p className="text-[11px] text-slate-400">Soma das Dobras</p>
                  <p className="text-lg font-bold text-white mt-0.5">{caliperResult.sumMm} mm</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Densidade Corporal</p>
                  <p className="text-lg font-bold text-slate-200 mt-0.5">{caliperResult.density}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">% Gordura (Siri)</p>
                  <p className="text-xl font-bold text-cyan-300 mt-0.5">{caliperResult.bodyFatPct}%</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  placeholder="Observação opcional (ex.: avaliado em jejum, pós-ciclo...)"
                  value={caliperNote}
                  onChange={(e) => setCaliperNote(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                />
                <button
                  onClick={handleSaveCaliperAssessment}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 px-4 py-2 text-xs font-bold text-slate-950 hover:opacity-95 transition"
                >
                  Salvar & Integrar ao Painel
                </button>
              </div>
            </div>
          </div>
        )}

        {mainModule === "anthropometry" && activeSubTab === "body" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/65 p-5 space-y-4">
            <h2 className="text-base font-bold text-white">Composição Corporal & Circunferências (cm)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {Object.entries(activeProfile.measurements || {}).map(([key, val]) => (
                <label key={key} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 space-y-1">
                  <span className="text-slate-400 capitalize block">{key} (cm)</span>
                  <input
                    type="number"
                    step="0.5"
                    value={val}
                    onChange={(e) =>
                      updateActiveProfile((prev) => ({
                        ...prev,
                        measurements: {
                          ...(prev.measurements || {}),
                          [key]: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-white"
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {mainModule === "clinical" && activeSubTab === "encyclopedia" && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/65 p-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por princípio ativo ou nome comercial (ex.: Ozempic, Mounjaro, Durateston)..."
                  value={drugSearch}
                  onChange={(e) => setDrugSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white"
                />
              </div>
              <select
                value={drugCategoryFilter}
                onChange={(e) => setDrugCategoryFilter(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
              >
                <option value="Todos">Todas as categorias</option>
                <option value="Peptídeos Metabólicos & Incretinas">Peptídeos Metabólicos & Incretinas</option>
                <option value="Hormônios & Reposição (TRT)">Hormônios & Reposição (TRT)</option>
                <option value="Eixo Tireoidiano">Eixo Tireoidiano</option>
                <option value="Metabolismo Glicídico, Lipídico & Cardiometabólico">Metabolismo Cardiometabólico</option>
              </select>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-4 space-y-2">
                {filteredDrugs.map((drug) => {
                  const isSel = selectedDrug.id === drug.id;
                  return (
                    <button
                      key={drug.id}
                      onClick={() => setSelectedDrugId(drug.id)}
                      className={`w-full text-left rounded-xl border p-3.5 transition ${
                        isSel
                          ? "border-cyan-400/50 bg-cyan-500/15"
                          : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{drug.name}</span>
                        <ChevronRight className="h-4 w-4 text-cyan-400" />
                      </div>
                      <p className="text-[11px] text-cyan-300 mt-0.5">
                        {(drug.nicknames || []).join(" · ")}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Meia-vida: ~{drug.halfLifeHours}h · {drug.route}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-8 rounded-2xl border border-cyan-500/20 bg-slate-900/65 p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                      {selectedDrug.category}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-0.5">{selectedDrug.name}</h2>
                    <p className="text-xs text-slate-400">
                      Nomes comerciais/referência: {(selectedDrug.nicknames || []).join(", ")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSendDrugToSimulator(selectedDrug)}
                    className="flex items-center gap-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 px-3.5 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/30 transition"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Enviar ao Simulador PK/PD
                  </button>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <div>
                    <h3 className="font-bold text-white flex items-center gap-1.5 mb-1">
                      <BookOpen className="h-3.5 w-3.5 text-cyan-400" /> Para que serve
                    </h3>
                    <p>{selectedDrug.summary}</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-white flex items-center gap-1.5 mb-1">
                      <Info className="h-3.5 w-3.5 text-cyan-400" /> Como age no organismo
                    </h3>
                    <p>{selectedDrug.mechanism}</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
                    <h3 className="font-bold text-cyan-200 flex items-center gap-1.5 mb-1">
                      <FileText className="h-3.5 w-3.5 text-cyan-400" /> Evidências & Estudos Clínicos
                    </h3>
                    <p className="text-slate-300">{selectedDrug.studies}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
                      <h4 className="font-bold text-amber-300 flex items-center gap-1.5 mb-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" /> Efeitos Adversos & Atenção
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-slate-300">
                        {(selectedDrug.sideEffects || []).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5">
                      <h4 className="font-bold text-rose-300 flex items-center gap-1.5 mb-1.5">
                        <ShieldAlert className="h-3.5 w-3.5" /> Contraindicações & Monitoramento
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-slate-300">
                        {(selectedDrug.contraindications || []).map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                      <p className="mt-2 text-[11px] text-cyan-200">
                        <strong>Exames:</strong> {(selectedDrug.monitoring || []).join(" · ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {mainModule === "clinical" && activeSubTab === "simulator" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/65 p-5 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white">Simulador Educacional de Exposição PK/PD</h2>
                <p className="text-xs text-slate-400">
                  Curva ilustrativa de acúmulo e decaimento baseada em meia-vida e intervalo de administração.
                </p>
              </div>
              <select
                value={simHorizonDays}
                onChange={(e) => setSimHorizonDays(Number(e.target.value))}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white"
              >
                <option value={28}>Janela de 28 dias</option>
                <option value={56}>Janela de 56 dias</option>
                <option value={84}>Janela de 84 dias</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <svg viewBox="0 0 700 190" className="w-full min-w-[500px] rounded-xl bg-[#040C1B] border border-slate-800 p-3">
                <line x1="45" y1="155" x2="675" y2="155" stroke="#1e293b" strokeWidth="1" />
                {(() => {
                  if (!simulationSeries.length) return null;
                  const pts = simulationSeries
                    .map((pt, idx) => {
                      const x = 50 + (idx * 615) / Math.max(1, simulationSeries.length - 1);
                      const y = 150 - (pt.level / 100) * 125;
                      return `${x},${y}`;
                    })
                    .join(" ");
                  return <polyline fill="none" stroke="#22d3ee" strokeWidth="2.5" points={pts} />;
                })()}
              </svg>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Fármacos no Protocolo Simulado
              </h3>
              {(activeProfile.activeDrugs || []).map((entry) => {
                const info = DRUG_CATALOG.find((d) => d.id === entry.drugId);
                if (!info) return null;
                return (
                  <div
                    key={entry.uid}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/75 p-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{info.name}</p>
                      <p className="text-slate-400">Meia-vida: ~{info.halfLifeHours}h · {info.route}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-slate-300">
                        <span>Dose ({info.unit}):</span>
                        <input
                          type="number"
                          step="0.05"
                          value={entry.doseMg}
                          onChange={(e) =>
                            updateActiveProfile((prev) => ({
                              ...prev,
                              activeDrugs: prev.activeDrugs.map((x) =>
                                x.uid === entry.uid ? { ...x, doseMg: Number(e.target.value) } : x
                              ),
                            }))
                          }
                          className="w-20 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-white"
                        />
                      </label>
                      <label className="flex items-center gap-1 text-slate-300">
                        <span>Cada (dias):</span>
                        <input
                          type="number"
                          min="1"
                          value={entry.intervalDays}
                          onChange={(e) =>
                            updateActiveProfile((prev) => ({
                              ...prev,
                              activeDrugs: prev.activeDrugs.map((x) =>
                                x.uid === entry.uid ? { ...x, intervalDays: Number(e.target.value) } : x
                              ),
                            }))
                          }
                          className="w-16 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-white"
                        />
                      </label>
                      <button
                        onClick={() =>
                          updateActiveProfile((prev) => ({
                            ...prev,
                            activeDrugs: prev.activeDrugs.filter((x) => x.uid !== entry.uid),
                          }))
                        }
                        className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-1.5 text-rose-300 hover:bg-rose-500/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <footer className="rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-[11px] text-slate-400">
          Uso educacional e de apoio organizacional/antropométrico. Estimativas de % de gordura (Jackson & Pollock / Siri) e simulações PK/PD não substituem avaliação clínica, prescrição ou acompanhamento profissional individualizado.
        </footer>
      </main>
    </div>
  );
}
