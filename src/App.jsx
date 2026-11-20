import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Activity,
  Stethoscope,
  Flame,
  Ruler,
  Utensils,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  HeartPulse,
  Calendar,
  Scale,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  PieChart,
  ShieldAlert,
  Clock,
  Layers,
  Search,
  FlaskConical,
  FileText,
  Info,
  Target,
  UserCheck,
  Crosshair,
  ChevronRight,
  BookmarkCheck
} from 'lucide-react';

// ============================================================================
// 1. BASE DE DADOS CLÍNICA COMPLETA: 14 FÁRMACOS REGULAMENTADOS (ANVISA/FDA)
// ============================================================================
const DRUG_CATEGORIES = [
  { id: 'all', label: 'Todos (14)' },
  { id: 'peptideos', label: '1. Peptídeos & Incretinas' },
  { id: 'hormonios', label: '2. Hormônios & TRT' },
  { id: 'tireoide', label: '3. Eixo Tireoidiano' },
  { id: 'cardiometabolico', label: '4. Cardiometabólico' }
];

const REGULATED_DRUGS = [
  // CATEGORIA 1: PEPTÍDEOS DE EMAGRECIMENTO & INCRETINAS
  {
    id: 'semaglutida',
    category: 'peptideos',
    categoryLabel: 'Peptídeos Metabólicos & Incretinas',
    name: 'Semaglutida',
    brandNames: '"Ozempic" / "Wegovy" / "Rybelsus"',
    drugClass: 'Agonista Seletivo do Receptor GLP-1',
    isIncretin: true,
    isOral: false,
    halfLifeHours: 168,
    halfLifeDays: 7.0,
    tmaxText: '24 a 72 horas (1–3 dias)',
    bioavailability: '~89% (Subcutânea) | ~0,4–1% (Oral com SNAC)',
    metabolismExcretion: 'Clivagem proteolítica por endopeptidases e beta-oxidação da cadeia graxa; excreção urinária e fecal.',
    route: 'SC Semanal (ou Oral Diária)',
    defaultFreqDays: 7,
    unit: 'mg',
    standardDoses: [0.25, 0.5, 1.0, 1.7, 2.4],
    defaultDose: 1.0,
    color: '#00e5ff',
    indications:
      'Tratamento do Diabetes Mellitus tipo 2 (DM2) insuficientemente controlado, redução do risco cardiovascular maior em adultos com DM2 ou obesidade/sobrepeso com doença cardiovascular estabelecida, e controle crônico de peso (IMC ≥ 30 kg/m² ou ≥ 27 kg/m² com comorbidades).',
    mechanism:
      'Análogo de GLP-1 humano com 94% de homologia estrutural ligado reversivelmente à albumina plasmática via cadeia diácida C18. Atua em receptores GLP-1R nas células beta pancreáticas (estimulando secreção de insulina de forma glicose-dependente), células alfa (suprimindo glucagon), trato gastrointestinal (retardando o esvaziamento gástrico) e hipotálamo/tronco encefálico (núcleo arqueado POMC/CART e inibição de NPY/AgRP, reduzindo apetite e desejo por alimentos hiperpalatáveis).',
    clinicalStudies:
      '• Programa STEP (STEP 1, n=1.961): Perda ponderal média de 14,9% em 68 semanas com 2,4 mg SC vs. 2,4% no placebo, com 86,4% atingindo perda ≥ 5%.\n• Estudo SELECT (n=17.604): Redução de 20% na incidência de eventos cardiovasculares maiores (MACE: morte CV, infarto ou AVC não fatal) em pacientes com obesidade sem diabetes.\n• Programa SUSTAIN: Redução média de HbA1c entre -1,5% e -1,8%.',
    timelineEffects: {
      w1_2: 'Início do retardo do esvaziamento gástrico e saciedade precoce; maior incidência de náuseas transitórias na titulação inicial (0,25 mg).',
      w4_8: 'Atingimento do estado estacionário (steady-state em ~4–5 semanas); estabilização glicêmica pós-prandial e redução consistente da ingestão energética.',
      w12_plus: 'Platô farmacocinético consolidado; redução expressiva de gordura visceral, circunferência abdominal e proteína C-reativa ultrassensível (PCR-us).'
    },
    sideEffects:
      'Náuseas (15–44%), diarreia, constipação, vômitos, dispepsia, refluxo gastroesofágico, cefaleia, fadiga e colelitíase secundária à perda rápida de peso.',
    contraindications:
      'Histórico pessoal ou familiar de Carcinoma Medular de Tireoide (CMT), Síndrome de Neoplasia Endócrina Múltipla tipo 2 (NEM 2), gestação/lactação e pancreatite aguda prévia.',
    labMonitoring:
      'Glicemia de jejum, HbA1c, perfil lipídico, amilase/lipase (se dor abdominal), creatinina/TFG (se desidratação GI) e ultrassonografia biliar se sintomático.'
  },
  {
    id: 'tirzepatida',
    category: 'peptideos',
    categoryLabel: 'Peptídeos Metabólicos & Incretinas',
    name: 'Tirzepatida',
    brandNames: '"Mounjaro" / "Zepbound"',
    drugClass: 'Agonista Duplo dos Receptores GIP e GLP-1 ("Twincretin")',
    isIncretin: true,
    isOral: false,
    halfLifeHours: 120,
    halfLifeDays: 5.0,
    tmaxText: '8 a 72 horas',
    bioavailability: '~80% (Subcutânea)',
    metabolismExcretion: 'Clivagem proteolítica da cadeia peptídica e beta-oxidação do diácido C20; metabólitos eliminados na urina e fezes.',
    route: 'SC Semanal',
    defaultFreqDays: 7,
    unit: 'mg',
    standardDoses: [2.5, 5.0, 7.5, 10.0, 12.5, 15.0],
    defaultDose: 5.0,
    color: '#14b8a6',
    indications:
      'Controle glicêmico em adultos com Diabetes Mellitus tipo 2 e tratamento farmacológico crônico da obesidade (IMC ≥ 30 kg/m²) ou sobrepeso (IMC ≥ 27 kg/m²) com comorbidades metabólicas ou apneia obstrutiva do sono.',
    mechanism:
      'Polipeptídeo sintético de 39 aminoácidos com agonismo dual nos receptores GIP (polipeptídeo insulinotrópico dependente de glicose) e GLP-1. O componente GIP atua diretamente nos adipócitos brancos melhorando o armazenamento lipídico saudável, reduzindo a lipotoxicidade ectópica (hepática e muscular) e potencializando a sinalização central de saciedade mediada pelo GLP-1.',
    clinicalStudies:
      '• Estudo SURMOUNT-1 (n=2.539, 72 semanas): Perda ponderal média de 15,0% (5 mg), 19,5% (10 mg) e 20,9% (15 mg) vs. 3,1% no placebo; 95,3% dos participantes com pré-diabetes reverteram para normoglicemia.\n• Estudo SURMOUNT-2 & Programa SURPASS: Redução de HbA1c de até -2,3% e melhora superior na sensibilidade insulínica (HOMA-IR) comparado à semaglutida 1 mg.',
    timelineEffects: {
      w1_2: 'Supressão pronunciada do apetite ("ruído alimentar") e atenuação imediata de picos glicêmicos pós-prandiais.',
      w4_8: 'Steady-state alcançado em ~3,5 a 4 semanas (20–25 dias); queda expressiva do índice HOMA-IR, triglicerídeos e esteatose hepática.',
      w12_plus: 'Redução acentuada de massa gorda total e gordura visceral; exige aporte proteico ≥ 1,8–2,2 g/kg/dia e treino resistido para preservação da massa magra.'
    },
    sideEffects:
      'Náuseas, diarreia, redução acentuada do apetite, constipação, desconforto epigástrico, eructação e fadiga transitória durante escalonamento de dose.',
    contraindications:
      'Histórico pessoal/familiar de Carcinoma Medular de Tireoide (CMT), NEM 2, hipersensibilidade conhecida, gestação e gastroparesia grave.',
    labMonitoring:
      'HbA1c, insulina basal/HOMA-IR, perfil lipídico, transaminases hepáticas (TGO/TGP/GGT), função renal e avaliação de composição corporal (adipômetro/DXA).'
  },
  {
    id: 'liraglutida',
    category: 'peptideos',
    categoryLabel: 'Peptídeos Metabólicos & Incretinas',
    name: 'Liraglutida',
    brandNames: '"Saxenda" / "Victoza"',
    drugClass: 'Agonista de Receptor GLP-1 de Ação Diária',
    isIncretin: true,
    isOral: false,
    halfLifeHours: 13,
    halfLifeDays: 0.54,
    tmaxText: '8 a 12 horas',
    bioavailability: '~55% (Subcutânea)',
    metabolismExcretion: 'Degradação endógena por DPP-4 e endopeptidase neutra (NEP) sem órgão específico de eliminação.',
    route: 'SC Diária',
    defaultFreqDays: 1,
    unit: 'mg',
    standardDoses: [0.6, 1.2, 1.8, 2.4, 3.0],
    defaultDose: 1.8,
    color: '#38bdf8',
    indications:
      'Controle glicêmico em DM2 (até 1,8 mg/dia - "Victoza") e controle crônico de peso em adultos e adolescentes com obesidade (até 3,0 mg/dia - "Saxenda").',
    mechanism:
      'Análogo acilado de GLP-1 humano (97% homologia) com cadeia de ácido palmítico C16 que promove auto-associação em heptâmeros no subcutâneo e ligação à albumina, conferindo meia-vida de ~13 horas e controle diário contínuo da saciedade hipotalâmica.',
    clinicalStudies:
      '• Programa SCALE Obesity & Prediabetes (n=3.731, 56 semanas): Redução ponderal média de 8,0% (vs. 2,6% placebo) com 3,0 mg/dia.\n• Estudo LEADER (n=9.340): Redução de 13% em eventos cardiovasculares maiores e 22% na morte cardiovascular em pacientes com DM2 de alto risco.',
    timelineEffects: {
      w1_2: 'Equilíbrio plasmático rápido (steady-state em 2–3 dias); titulação semanal de 0,6 mg minimiza náuseas agudas.',
      w4_8: 'Atingimento da dose alvo (1,8 mg ou 3,0 mg); redução consistente da ingestão calórica e melhora da glicemia de jejum.',
      w12_plus: 'Manutenção de saciedade diária previsível; elevação discreta e esperada da frequência cardíaca de repouso (2–3 bpm).'
    },
    sideEffects:
      'Náuseas transitórias (especialmente nas primeiras 4 semanas), cefaleia, constipação, dispepsia, reação eritematosa no local da aplicação e discreto aumento da FCR.',
    contraindications:
      'Histórico pessoal ou familiar de CMT, NEM 2, gestação, amamentação e insuficiência cardíaca classe IV NYHA.',
    labMonitoring:
      'Glicemia, HbA1c, frequência cardíaca de repouso (FCR), lipídios séricos e enzimas pancreáticas se dor abdominal.'
  },
  {
    id: 'dulaglutida',
    category: 'peptideos',
    categoryLabel: 'Peptídeos Metabólicos & Incretinas',
    name: 'Dulaglutida',
    brandNames: '"Trulicity"',
    drugClass: 'Agonista GLP-1 Fundido a Fragmento Fc (IgG4)',
    isIncretin: true,
    isOral: false,
    halfLifeHours: 112,
    halfLifeDays: 4.67,
    tmaxText: '24 a 72 horas (média 48h)',
    bioavailability: '~47% a 65% (Subcutânea)',
    metabolismExcretion: 'Catabolismo proteico geral em aminoácidos componentes; sem depuração renal significativa por alto peso molecular (~63 kDa).',
    route: 'SC Semanal',
    defaultFreqDays: 7,
    unit: 'mg',
    standardDoses: [0.75, 1.5, 3.0, 4.5],
    defaultDose: 1.5,
    color: '#a78bfa',
    indications:
      'Tratamento de adultos com Diabetes Mellitus tipo 2 e redução de risco cardiovascular primário e secundário em pacientes diabéticos.',
    mechanism:
      'Dois análogos idênticos de GLP-1 resistentes à DPP-4 ligados covalentemente a uma cadeia pesada modificada de imunoglobulina G4 humana (Fc), reduzindo a filtração glomerular e conferindo meia-vida de ~4,7 dias.',
    clinicalStudies:
      '• Estudo REWIND (n=9.901, seguimento mediano de 5,4 anos): Redução de 12% em eventos cardiovasculares maiores inclusive em pacientes sem doença cardiovascular estabelecida (prevenção primária).\n• Programa AWARD: Redução sustentada de HbA1c de -1,2% a -1,8% e perda ponderal moderada (3,0 a 4,7 kg com 4,5 mg).',
    timelineEffects: {
      w1_2: 'Início gradual da modulação pós-prandial de insulina e glucagon nas primeiras 48h pós-injeção.',
      w4_8: 'Steady-state atingido em ~3 semanas (~21 dias); redução da variabilidade glicêmica e saciedade moderada.',
      w12_plus: 'Proteção endotelial e renal (redução de albuminúria) associada ao controle metabólico sustentado.'
    },
    sideEffects:
      'Náuseas, diarreia, dor abdominal leve, diminuição do apetite, fadiga e elevação assintomática discreta de enzimas pancreáticas.',
    contraindications:
      'Histórico pessoal/familiar de Carcinoma Medular de Tireoide (CMT), NEM 2, doença gastrointestinal grave e gestação.',
    labMonitoring:
      'HbA1c, glicemia de jejum, relação albumina/creatinina urinária, TFG e perfil lipídico.'
  },

  // CATEGORIA 2: HORMÔNIOS & REPOSIÇÃO (TRT REGULAMENTADA)
  {
    id: 'durateston',
    category: 'hormonios',
    categoryLabel: 'Hormônios & Reposição (TRT)',
    name: 'Associação de 4 Ésteres de Testosterona',
    brandNames: '"Durateston" / "Sustanon 250"',
    drugClass: 'Blend Multi-Éster Androgênico (Propionato, Fempropionato, Isocaproato, Decanoato)',
    isIncretin: false,
    isOral: false,
    isMultiEster: true,
    esters: [
      { name: 'Propionato (30mg)', fraction: 0.12, halfLifeDays: 0.85, ka: 4.5 },
      { name: 'Fempropionato (60mg)', fraction: 0.24, halfLifeDays: 2.0, ka: 2.8 },
      { name: 'Isocaproato (60mg)', fraction: 0.24, halfLifeDays: 4.0, ka: 1.8 },
      { name: 'Decanoato (100mg)', fraction: 0.40, halfLifeDays: 10.0, ka: 1.1 }
    ],
    halfLifeHours: 180,
    halfLifeDays: 7.5,
    tmaxText: '24 a 48 horas (Pico do Propionato/Fempropionato)',
    bioavailability: '~100% (Intramuscular Profunda em Veículo Oleoso)',
    metabolismExcretion: 'Hidrólise plasmática por esterases liberando testosterona livre; metabolização hepática em androsterona/etiocolanolona e excreção urinária (90%).',
    route: 'IM Profunda',
    defaultFreqDays: 14,
    unit: 'mg',
    standardDoses: [125, 250, 500],
    defaultDose: 250,
    color: '#f472b6',
    indications:
      'Terapia de reposição de testosterona (TRT) em homens adultos com hipogonadismo primário ou secundário (hipogonadotrófico) confirmado por sinais clínicos e duas dosagens matinais baixas de testosterona sérica.',
    mechanism:
      'Combinação de 4 ésteres em 250 mg/mL (30 mg Propionato + 60 mg Fempropionato + 60 mg Isocaproato + 100 mg Decanoato). A lipofilicidade crescente das cadeias controla a velocidade de difusão do depósito oleoso intramuscular para a circulação: o Propionato garante ação rápida em 24h, enquanto Fempropionato, Isocaproato e Decanoato sustentam a liberação por até 2–3 semanas. A testosterona livre liga-se ao receptor androgênico (AR) citoplasmático, transloca-se ao núcleo e regula transcrição gênica anabólica, eritropoiética e neuroendócrina.',
    clinicalStudies:
      '• Farmacocinética Clínica (Behre & Nieschlag): Uma ampola de 250 mg gera pico sérico de testosterona total entre 24–48h pós-injeção, retornando ao limite inferior da normalidade entre os dias 14 e 21.\n• Consensos SBEM / Endocrine Society: A reposição fisiológica restaura massa livre de gordura (+1,5 a +3,0 kg), densidade mineral óssea, hematócrito, sensibilidade insulínica e função sexual em homens hipogonádicos.',
    timelineEffects: {
      w1_2: 'Pico androgênico rápido (24–48h) com melhora de libido, disposição e retenção hídrica leve; feedback negativo inicial sobre LH e FSH hipofisários.',
      w4_8: 'Estabilização do componente Decanoato; estímulo à secreção renal de eritropoietina e aumento da síntese proteica miofibrilar.',
      w12_plus: 'Remodelação corporal (redução de tecido adiposo visceral e ganho de massa magra) e elevação de hemoglobina/hematócrito; exige vigilância de estradiol (E2) e perfil lipídico.'
    },
    sideEffects:
      'Eritrocitose (elevação de hematócrito > 52%), supressão do eixo hipotálamo-hipófise-testicular (oligospermia/atrofia testicular), aromatização periférica em estradiol (ginecomastia/retenção), acne, oleosidade e redução de HDL-C.',
    contraindications:
      'Carcinoma de próstata ou mama masculina suspeito/confirmado, hematócrito basal > 54%, insuficiência cardíaca descompensada, apneia obstrutiva do sono grave não tratada e desejo imediato de fertilidade sem terapia adjuvante.',
    labMonitoring:
      'Testosterona total e livre, Estradiol (E2 ultrasensível), Hemograma completo (Hematócrito/Hemoglobina), PSA total/livre, Perfil lipídico (HDL/LDL) e TGO/TGP a cada 3–6 meses.'
  },
  {
    id: 'cipionato_testosterona',
    category: 'hormonios',
    categoryLabel: 'Hormônios & Reposição (TRT)',
    name: 'Cipionato de Testosterona',
    brandNames: '"Deposteron"',
    drugClass: 'Éster Único de Testosterona de Ação Intermediária',
    isIncretin: false,
    isOral: false,
    halfLifeHours: 192,
    halfLifeDays: 8.0,
    tmaxText: '48 a 72 horas',
    bioavailability: '~100% (Intramuscular / Subcutânea)',
    metabolismExcretion: 'Clivagem por esterases séricas; redução via 5-alfa-redutase (DHT) e aromatização via CYP19A1 (Estradiol); excreção renal.',
    route: 'IM Profunda',
    defaultFreqDays: 7,
    unit: 'mg',
    standardDoses: [50, 100, 150, 200],
    defaultDose: 100,
    color: '#fb7185',
    indications:
      'Reposição hormonal masculina no hipogonadismo primário ou hipogonadotrófico congênito ou adquirido.',
    mechanism:
      'Éster ciclopentilpropionato ligado ao grupo 17-beta-hidroxila da testosterona, conferindo meia-vida de eliminação de ~8 dias. Proporciona curva de liberação mais previsível e com menor pico inicial abrupto do que o blend multi-éster.',
    clinicalStudies:
      '• Diretrizes Endocrine Society & AUA: Doses de 75–100 mg/semana (ou 150–200 mg a cada 14 dias) mantêm concentrações séricas médias na faixa eugonádica (450–750 ng/dL). Estudos demonstram que o fracionamento semanal reduz oscilações pico-vale e picos de aromatização.',
    timelineEffects: {
      w1_2: 'Elevação gradual da testosterona sérica sem pico agudo abrupto; melhora inicial de energia e humor.',
      w4_8: 'Estado estacionário atingido em ~5 semanas (~35–40 dias); melhora da força muscular e sensibilidade insulínica.',
      w12_plus: 'Redução de gordura visceral, aumento de massa magra e melhora progressiva da densidade mineral óssea em 6–12 meses.'
    },
    sideEffects:
      'Elevação do hematócrito/hemoglobina, supressão de gonadotrofinas (LH/FSH), elevação de estradiol sérico, acne, alopecia androgenética em predispostos e edema leve.',
    contraindications:
      'Câncer de próstata, câncer de mama masculino, policitemia (hematócrito > 54%), hipertensão grave não controlada e gravidez.',
    labMonitoring:
      'Testosterona total/livre (coletada no vale antes da próxima dose), Estradiol, Hematócrito, PSA, Perfil lipídico e SHBG.'
  },
  {
    id: 'undecanoato_testosterona',
    category: 'hormonios',
    categoryLabel: 'Hormônios & Reposição (TRT)',
    name: 'Undecanoato de Testosterona',
    brandNames: '"Nebido" / "Hormus"',
    drugClass: 'Éster de Testosterona de Longa Duração (Depósito)',
    isIncretin: false,
    isOral: false,
    halfLifeHours: 672,
    halfLifeDays: 28.0,
    tmaxText: '7 a 14 dias',
    bioavailability: '~100% (IM Glútea Lenta — 4 mL)',
    metabolismExcretion: 'Liberação ultra-lenta do veículo de óleo de rícino/benzoato de benzila; hidrólise completa para testosterona endógena.',
    route: 'IM Longa Duração',
    defaultFreqDays: 70,
    unit: 'mg',
    standardDoses: [500, 750, 1000],
    defaultDose: 1000,
    color: '#c084fc',
    indications:
      'Terapia de reposição de testosterona de longa duração no hipogonadismo masculino primário e secundário.',
    mechanism:
      'Cadeia éster alifática longa de 11 carbonos que confere meia-vida terminal de 21 a 34 dias, mantendo níveis fisiológicos estáveis por 10 a 14 semanas sem flutuações semanais.',
    clinicalStudies:
      '• Estudos Longitudinais (Saad et al., seguimento de até 8 anos): Esquema de 1.000 mg no Dia 0, dose de ataque na Semana 6 e manutenção a cada 10–14 semanas manteve testosterona estável dentro da faixa normal em >95% dos pacientes, reduzindo circunferência abdominal, HbA1c e triglicerídeos.',
    timelineEffects: {
      w1_2: 'Liberação lenta e progressiva; níveis plasmáticos sobem suavemente sem picos suprafisiológicos de estradiol.',
      w4_8: 'Necessidade clínica de dose de reforço na Semana 6 para acelerar o alcance do platô terapêutico.',
      w12_plus: 'Estado estacionário consolidado após a 3ª aplicação; alta estabilidade de humor, libido e massa magra.'
    },
    sideEffects:
      'Desconforto local pela injeção de 4 mL (deve ser injetada lentamente em 2 minutos para evitar microembolia oleosa pulmonar transitória/tosse), eritrocitose gradual e supressão de LH/FSH.',
    contraindications:
      'Carcinoma prostático/mamário andrógeno-dependente, tumores hepáticos prévios ou atuais, hematócrito > 54% e alergia ao óleo de rícino.',
    labMonitoring:
      'Testosterona sérica imediatamente antes da próxima injeção (vale), Hematócrito/Hemoglobina, PSA, Estradiol e perfil lipídico.'
  },
  {
    id: 'testosterona_gel',
    category: 'hormonios',
    categoryLabel: 'Hormônios & Reposição (TRT)',
    name: 'Testosterona Transdérmica (Gel 1% / 1,62%)',
    brandNames: '"Androgel"',
    drugClass: 'Andrógeno Transdérmico de Liberação Contínua',
    isIncretin: false,
    isOral: false,
    halfLifeHours: 16,
    halfLifeDays: 0.67,
    tmaxText: '2 a 6 horas após aplicação cutânea',
    bioavailability: '~9% a 14% da dose aplicada atravessa o estrato córneo',
    metabolismExcretion: 'Conversão cutânea parcial em DHT pela 5-alfa-redutase dérmica; metabolização hepática e excreção urinária.',
    route: 'Tópica Diária (Ombros/Braços)',
    defaultFreqDays: 1,
    unit: 'mg',
    standardDoses: [25, 50, 75, 100],
    defaultDose: 50,
    color: '#60a5fa',
    indications:
      'Reposição hormonal masculina no hipogonadismo com preferência por via não injetável e perfil circadiano fisiológico.',
    mechanism:
      'O estrato córneo atua como reservatório cutâneo liberando testosterona continuamente na circulação ao longo de 24h, mimetizando o ritmo fisiológico sem picos suprafisiológicos de ésteres injetáveis.',
    clinicalStudies:
      '• Ensaios Clínicos (Swerdloff et al.): Aplicação diária de 50–100 mg normaliza testosterona sérica em >85% dos homens hipogonádicos já na primeira semana, apresentando menor taxa de eritrocitose comparado a ésteres intramusculares.',
    timelineEffects: {
      w1_2: 'Atingimento rápido de platô fisiológico estável em 2 a 3 dias de aplicação diária contínua.',
      w4_8: 'Melhora sustentada de energia, função sexual e composição corporal com menor aromatização para estradiol.',
      w12_plus: 'Manutenção fisiológica linear; maior conversão periférica relativa para DHT pela 5-alfa-redutase cutânea.'
    },
    sideEffects:
      'Irritação/eritema no local de aplicação, elevação de DHT (di-hidrotestosterona), risco de transferência secundária por contato pele a pele (mulheres/crianças) e elevação leve de PSA/hematócrito.',
    contraindications:
      'Câncer de próstata ou mama masculina, gestantes/crianças (risco de virilização por contato direto) e dermatites extensas na área de aplicação.',
    labMonitoring:
      'Testosterona total (2–4h após aplicação), DHT, Estradiol, Hematócrito e PSA.'
  },

  // CATEGORIA 3: EIXO TIREOIDIANO
  {
    id: 'levotiroxina',
    category: 'tireoide',
    categoryLabel: 'Eixo Tireoidiano',
    name: 'Levotiroxina Sódica (T4)',
    brandNames: '"Puran T4" / "Euthyrox" / "Synthroid"',
    drugClass: 'Pró-Hormônio Tireoidiano Sintético (L-Tiroxina)',
    isIncretin: false,
    isOral: true,
    halfLifeHours: 168,
    halfLifeDays: 7.0,
    tmaxText: '2 a 4 horas (em jejum)',
    bioavailability: '~60% a 80% (reduzida por alimentos, café, cálcio, ferro e IBP)',
    metabolismExcretion: 'Desiodação periférica (fígado, rins, músculo) pelas desiodases D1/D2 em T3 ativo ou D3 em T3 reverso; conjugação hepática e excreção biliar.',
    route: 'Oral Diária (Jejum 30–60 min)',
    defaultFreqDays: 1,
    unit: 'mcg',
    standardDoses: [25, 50, 75, 88, 100, 125, 150],
    defaultDose: 75,
    color: '#fbbf24',
    indications:
      'Terapia de reposição ou suplementação hormonal no hipotireoidismo primário, secundário ou terciário, e supressão de TSH no carcinoma diferenciado de tireoide.',
    mechanism:
      'Isômero levorrotatório sintético idêntico à tiroxina endógena. Circula >99% ligado a proteínas (TBG, transtirretina, albumina) e é convertido sob demanda tecidual em T3, que se liga aos receptores nucleares TR-alpha e TR-beta regulando taxa metabólica basal, termogênese, síntese proteica e receptores hepáticos de LDL.',
    clinicalStudies:
      '• Diretrizes ATA (American Thyroid Association) & SBEM: Dose plena de reposição estimada em ~1,6 mcg/kg/dia. Devido à meia-vida de 7 dias, alterações de dose requerem 4 a 6 semanas para atingir novo equilíbrio no eixo hipotálamo-hipófise-tireoide (TSH).',
    timelineEffects: {
      w1_2: 'Acúmulo plasmático gradual de T4 livre; sintomas clínicos ainda em transição lenta.',
      w4_8: 'Atingimento do estado estacionário (steady-state em ~30–42 dias); janela correta para dosagem de TSH e T4 Livre.',
      w12_plus: 'Normalização da taxa metabólica basal, depuração de colesterol LDL-C e resolução de fadiga/edema hipotireoideo.'
    },
    sideEffects:
      'Raros em dose eutireoidea; em superdosagem (tireotoxicose iatrogênica): palpitações, taquicardia, fibrilação atrial, tremores finos, ansiedade, insônia, sudorese e perda de densidade mineral óssea.',
    contraindications:
      'Tireotoxicose não tratada, infarto agudo do miocárdio recente, miocardite aguda e insuficiência adrenal não corrigida (risco de crise adrenal aguda).',
    labMonitoring:
      'TSH ultrasensível e T4 Livre após 4–6 semanas de cada ajuste de dose, e a cada 6–12 meses após estabilização.'
  },
  {
    id: 'liotironina',
    category: 'tireoide',
    categoryLabel: 'Eixo Tireoidiano',
    name: 'Liotironina Sódica (T3)',
    brandNames: '"Cynomel"',
    drugClass: 'Hormônio Tireoidiano Biologicamente Ativo (L-Tri-iodotironina)',
    isIncretin: false,
    isOral: true,
    halfLifeHours: 24,
    halfLifeDays: 1.0,
    tmaxText: '2 a 4 horas',
    bioavailability: '~95% (Absorção rápida e quase completa)',
    metabolismExcretion: 'Desiodação sequencial hepática e renal em T2/T1 e conjugação com sulfato/glicuronídeo; excreção biliar e urinária.',
    route: 'Oral (1 a 2x/dia)',
    defaultFreqDays: 1,
    unit: 'mcg',
    standardDoses: [5, 10, 12.5, 25, 50],
    defaultDose: 12.5,
    color: '#f97316',
    indications:
      'Hipotireoidismo grave/coma mixedematoso, preparo para radioiodoterapia e terapia combinada selecionada (T4 + T3) sob supervisão endocrinológica rigorosa em pacientes com polimorfismos de desiodase (DIO2) sintomáticos.',
    mechanism:
      'Forma hormonal metabolicamente ativa com afinidade ~10 vezes maior pelos receptores nucleares tireoidianos que o T4. Eleva rapidamente o consumo de oxigênio mitocondrial, expressão de Na+/K+-ATPase, lipólise e frequência cardíaca.',
    clinicalStudies:
      '• Consensos ETA / ATA (Wiersinga et al.): Meia-vida curta (~24h) provoca picos séricos pós-dose e supressão rápida de TSH; quando indicado em terapia combinada com T4, recomenda-se fracionamento em 2 tomadas diárias para evitar picos cronotrópicos.',
    timelineEffects: {
      w1_2: 'Ação metabólica imediata (24–72h) e supressão rápida da secreção hipofisária de TSH.',
      w4_8: 'Risco de catabolismo proteico muscular e balanço nitrogenado negativo se utilizado em doses suprafisiológicas.',
      w12_plus: 'Exige vigilância rigorosa cardiovascular (risco de arritmia) e densidade mineral óssea.'
    },
    sideEffects:
      'Taquicardia, extrassístoles, fibrilação atrial, angina em coronariopatas, nervosismo, insônia, sudorese excessiva, diarreia e perda de massa muscular em doses excessivas.',
    contraindications:
      'Arritmias cardíacas, doença arterial coronariana não controlada, hipertireoidismo, insuficiência adrenal não tratada e gestação (não atravessa adequadamente a barreira placentária para o feto).',
    labMonitoring:
      'T3 Livre, T4 Livre, TSH, Eletrocardiograma (ECG), Frequência Cardíaca de Repouso e Pressão Arterial.'
  },

  // CATEGORIA 4: METABOLISMO GLICÍDICO, LIPÍDICO & CARDIOMETABÓLICO
  {
    id: 'metformina_xr',
    category: 'cardiometabolico',
    categoryLabel: 'Metabolismo Glicídico, Lipídico & Cardiometabólico',
    name: 'Metformina (Liberação Prolongada / Imediata)',
    brandNames: '"Glifage XR" / "Glifage"',
    drugClass: 'Biguanida Sensibilizadora de Insulina (Ativadora de AMPK)',
    isIncretin: false,
    isOral: true,
    halfLifeHours: 6.5,
    halfLifeDays: 0.27,
    tmaxText: '4 a 8 horas (XR) | 2 a 3 horas (IR)',
    bioavailability: '~50% a 60% (Excreção renal inalterada via transportadores OCT2/MATE)',
    metabolismExcretion: 'Não sofre metabolização hepática; excretada 100% inalterada pelos túbulos renais.',
    route: 'Oral Diária (com refeição)',
    defaultFreqDays: 1,
    unit: 'mg',
    standardDoses: [500, 850, 1000, 1500, 2000],
    defaultDose: 1000,
    color: '#34d399',
    indications:
      'Tratamento de primeira linha do Diabetes Mellitus tipo 2, prevenção de DM2 em pacientes com pré-diabetes/resistência insulínica e manejo metabólico na Síndrome dos Ovários Policísticos (SOP).',
    mechanism:
      'Inibe parcialmente o complexo I da cadeia respiratória mitocondrial hepática, elevando a razão AMP/ATP e ativando a quinase AMPK. Isso suprime a gliconeogênese hepática, aumenta a translocação de GLUT4 no músculo esquelético e eleva níveis endógenos do peptídeo anorexígeno GDF-15 e GLP-1 intestinal.',
    clinicalStudies:
      '• Estudo UKPDS: Redução de 36% na mortalidade por todas as causas e 39% no infarto do miocárdio em pacientes diabéticos com sobrepeso.\n• Diabetes Prevention Program (DPP, n=3.234): Redução de 31% na progressão de pré-diabetes para DM2 sem causar hipoglicemia ou ganho ponderal.',
    timelineEffects: {
      w1_2: 'Steady-state plasmático em 24–48h; fase inicial de adaptação da microbiota intestinal e trato gastrointestinal.',
      w4_8: 'Redução consistente da glicemia de jejum (-20 a -40 mg/dL) e melhora da sensibilidade periférica à insulina.',
      w12_plus: 'Efeito pleiotrópico endotelial consolidado; em uso > 1–2 anos, monitorar Vitamina B12 por redução da absorção ileal.'
    },
    sideEffects:
      'Desconforto abdominal, fezes amolecidas, flatulência, gosto metálico (muito reduzidos na formulação XR); depleção de vitamina B12 a longo prazo; acidose lática (raríssima, associada a insuficiência renal grave).',
    contraindications:
      'Taxa de Filtração Glomerular (TFG) < 30 mL/min/1,73m², acidose metabólica aguda, insuficiência hepática grave, alcoolismo agudo e suspensão temporária antes de contraste iodado.',
    labMonitoring:
      'Creatinina sérica e TFG estimada (anual/semestral), HbA1c, Glicemia de jejum e dosagem anual de Vitamina B12.'
  },
  {
    id: 'inibidor_sglt2',
    category: 'cardiometabolico',
    categoryLabel: 'Metabolismo Glicídico, Lipídico & Cardiometabólico',
    name: 'Empagliflozina / Dapagliflozina',
    brandNames: '"Jardiance" / "Forxiga"',
    drugClass: 'Inibidor Seletivo do Cotransportador Sódio-Glicose 2 (iSGLT2)',
    isIncretin: false,
    isOral: true,
    halfLifeHours: 12.5,
    halfLifeDays: 0.52,
    tmaxText: '1,5 a 2 horas',
    bioavailability: '~75% a 78%',
    metabolismExcretion: 'Glicuronidação hepática via UGT1A9/UGT2B7 em metabólitos inativos; eliminação renal e fecal.',
    route: 'Oral Diária (Manhã)',
    defaultFreqDays: 1,
    unit: 'mg',
    standardDoses: [5, 10, 25],
    defaultDose: 10,
    color: '#10b981',
    indications:
      'Diabetes Mellitus tipo 2, Insuficiência Cardíaca (com fração de ejeção reduzida ou preservada) e Doença Renal Crônica (DRC) com albuminúria, independentemente da presença de diabetes.',
    mechanism:
      'Inibe seletivamente o cotransportador SGLT2 no segmento S1 do túbulo contorcido proximal renal, bloqueando a reabsorção de ~90% da glicose filtrada e promovendo glicosúria terapêutica (~60–80 g glicose/dia = ~240–320 kcal/dia) e natriurese. Restaura o feedback tubuloglomerular, reduzindo a pressão intraglomerular e a hiperfiltração.',
    clinicalStudies:
      '• EMPA-REG OUTCOME (n=7.020): Redução de 38% na morte cardiovascular e 35% nas hospitalizações por insuficiência cardíaca.\n• DAPA-HF & EMPA-KIDNEY: Redução de ~28–37% na progressão da doença renal crônica ou morte renal.',
    timelineEffects: {
      w1_2: 'Início imediato da glicosúria e natriurese; queda discreta da pressão arterial sistólica (3–5 mmHg) e elevação leve do hematócrito por hemoconcentração benéfica.',
      w4_8: 'Queda inicial esperada e reversível de 3–5 mL/min na TFG ("dip" hemodinâmico protetor glomerular) e perda ponderal de 1,5–2,5 kg.',
      w12_plus: 'Nefroproteção e cardioproteção consolidadas com aumento da oxidação lipídica e cetogênese fisiológica leve (combustível miocárdico eficiente).'
    },
    sideEffects:
      'Infecções micóticas genitais (candidíase vulvovaginal ou balanite), poliúria, depleção volêmica/hipotensão ortostática em idosos e risco raro de cetoacidose diabética euglicêmica (especialmente em jejum prolongado ou dieta cetogênica estrita).',
    contraindications:
      'Diabetes tipo 1 (alto risco de cetoacidose euglicêmica), cetoacidose diabética, diálise e hipersensibilidade.',
    labMonitoring:
      'Creatinina/TFG, relação albumina/creatinina urinária, HbA1c, eletrólitos e orientação de higiene íntima e hidratação adequada.'
  },
  {
    id: 'estatina_alta_potencia',
    category: 'cardiometabolico',
    categoryLabel: 'Metabolismo Glicídico, Lipídico & Cardiometabólico',
    name: 'Rosuvastatina / Atorvastatina',
    brandNames: '"Crestor" / "Lipitor"',
    drugClass: 'Inibidor Competitivo da HMG-CoA Redutase (Estatina de Alta Intensidade)',
    isIncretin: false,
    isOral: true,
    halfLifeHours: 19,
    halfLifeDays: 0.79,
    tmaxText: '3 a 5 horas (Rosuvastatina) | 1 a 2 horas (Atorvastatina)',
    bioavailability: '~20% (Rosuvastatina) | ~14% (Atorvastatina) — alta captação seletiva hepática via OATP1B1',
    metabolismExcretion: 'Rosuvastatina: excreção biliar/fecal 90% inalterada (mínima via CYP2C9). Atorvastatina: metabolização via CYP3A4 e excreção biliar.',
    route: 'Oral Diária',
    defaultFreqDays: 1,
    unit: 'mg',
    standardDoses: [5, 10, 20, 40],
    defaultDose: 10,
    color: '#38bdf8',
    indications:
      'Hipercolesterolemia primária, dislipidemia mista, hipertrigliceridemia e prevenção primária ou secundária de eventos cardiovasculares ateroscleróticos (infarto, AVC, revascularização).',
    mechanism:
      'Inibe competitivamente a enzima limitante da biossíntese de colesterol no hepatócito (HMG-CoA redutase). A redução do colesterol intra-hepático ativa o fator SREBP-2, promovendo suprarregulação dos receptores de LDL (LDL-R) na membrana dos hepatócitos e acelerando a depuração plasmática de partículas aterogênicas ApoB.',
    clinicalStudies:
      '• Estudo JUPITER (n=17.802, Rosuvastatina 20 mg): Redução de 50% no LDL-C, 37% na PCR-us e 44% nos eventos cardiovasculares maiores.\n• Metanálises CTT (Cholesterol Treatment Trialists): Cada queda de 38,7 mg/dL (1 mmol/L) no LDL-C reduz em ~22% os eventos vasculares maiores em 5 anos.',
    timelineEffects: {
      w1_2: 'Inibição imediata da síntese hepática de colesterol; queda expressiva de LDL-C já detectável em 14 dias.',
      w4_8: 'Atingimento da redução máxima de LDL-C (-45% a -55%), não-HDL-C e ApoB; estabilização da capa fibrosa de placas ateroscleróticas.',
      w12_plus: 'Efeito pleiotrópico anti-inflamatório vascular (queda de PCR-us) e regressão de volume de ateroma em terapia de alta intensidade.'
    },
    sideEffects:
      'Mialgia benigna (5–10%), elevação assintomática transitória de transaminases (TGO/TGP), cefaleia, elevação discreta de HbA1c em pré-dispostos e rabdomiólise (raríssima, < 0,01%).',
    contraindications:
      'Doença hepática ativa ou elevação persistente inexplicada de transaminases > 3x LSN, gestação, lactação e miopatia grave ativa.',
    labMonitoring:
      'Perfil lipídico completo (Colesterol Total, LDL-C, HDL-C, Triglicerídeos, ApoB), TGO/TGP e CPK (se sintomas musculares).'
  },
  {
    id: 'orlistate',
    category: 'cardiometabolico',
    categoryLabel: 'Metabolismo Glicídico, Lipídico & Cardiometabólico',
    name: 'Orlistate',
    brandNames: '"Xenical"',
    drugClass: 'Inibidor Reversível das Lipases Gástrica e Pancreática',
    isIncretin: false,
    isOral: true,
    halfLifeHours: 2,
    halfLifeDays: 0.08,
    tmaxText: 'Ação local intraluminal imediata durante a digestão',
    bioavailability: '< 1% (Absorção sistêmica desprezível; ação estritamente gastrointestinal)',
    metabolismExcretion: '97% excretado nas fezes (83% como fármaco inalterado).',
    route: 'Oral (3x/dia junto às refeições com gordura)',
    defaultFreqDays: 0.33,
    unit: 'mg',
    standardDoses: [60, 120],
    defaultDose: 120,
    color: '#94a3b8',
    indications:
      'Tratamento adjuvante da obesidade e sobrepeso associado a dislipidemia, hipertensão ou pré-diabetes em conjunto com dieta hipocalórica.',
    mechanism:
      'Liga-se covalentemente ao resíduo ativo de serina das lipases gástrica e pancreática no lúmen do estômago e intestino delgado, impedindo a hidrólise de triglicerídeos em ácidos graxos livres e monoglicerídeos absorvíveis, bloqueando ~30% da absorção da gordura dietética.',
    clinicalStudies:
      '• Estudo XENDOS (n=3.305, duração de 4 anos): Perda ponderal significativamente superior ao placebo associado à mudança de estilo de vida, com redução adicional de 37% no risco de progressão para diabetes tipo 2 e queda independente de LDL-C.',
    timelineEffects: {
      w1_2: 'Bloqueio imediato de ~30% dos triglicerídeos ingeridos; atua também como biofeedback educativo contra refeições hiperlipídicas.',
      w4_8: 'Redução progressiva de absorção calórica lipídica e queda adicional de colesterol LDL por menor incorporação micelar.',
      w12_plus: 'Potencial redução nos níveis séricos de vitaminas lipossolúveis (A, D, E, K) se não suplementadas em horário afastado.'
    },
    sideEffects:
      'Esteatorreia (fezes oleosas), urgência fecal, flatulência com descarga oleosa (proporcional ao teor de gordura da refeição) e redução da absorção de vitaminas lipossolúveis (A, D, E, K).',
    contraindications:
      'Síndrome de má absorção crônica, colestase, gestação/lactação e uso concomitante com ciclosporina (reduz absorção do imunossupressor).',
    labMonitoring:
      '25-OH-Vitamina D, perfil lipídico e função hepática; administrar polivitamínico lipossolúvel ao menos 2 horas antes ou depois do Orlistate.'
  }
];

// ============================================================================
// 2. BASE DE DADOS ANATÔMICA DO ADIPÔMETRO (PREGAS CUTÂNEAS)
// ============================================================================
const SKINFOLD_SITES = {
  peitoral: {
    id: 'peitoral',
    name: 'Peitoral (Torácica)',
    view: 'front',
    x: 112,
    y: 124,
    direction: 'Diagonal (acompanhando o eixo longitudinal do músculo peitoral maior)',
    location:
      'Homens: ponto médio exato entre a linha axilar anterior e o mamilo. Mulheres (JP7): um terço da distância entre a linha axilar anterior e o mamilo.',
    technique:
      'Com o avaliado em pé e braços relaxados ao longo do corpo, destaque a dobra cutânea com polegar e indicador da mão esquerda 1 cm acima do ponto marcado e posicione as hastes do adipômetro perpendicularmente à dobra. Realize a leitura em 2 segundos.',
    commonErrors:
      'Pinçar tecido glandular mamário ou posicionar a prega na horizontal em vez de diagonal.'
  },
  axilar_media: {
    id: 'axilar_media',
    name: 'Axilar Média',
    view: 'front',
    x: 84,
    y: 162,
    direction: 'Vertical (ou levemente oblíqua seguindo o arco costal)',
    location:
      'Intersecção da linha axilar média (descendo verticalmente do centro da fossa axilar) com uma linha horizontal traçada na altura da junção xifoesternal (processo xifoide).',
    technique:
      'Peça ao avaliado para abduzir levemente o braço direito (ou apoiar a mão sobre o ombro oposto sem contrair o serrátil). Destaque a dobra verticalmente na linha axilar média e aplique o adipômetro.',
    commonErrors:
      'Deslocar o ponto muito anteriormente (aproximando do peitoral) ou muito posteriormente (próximo ao latíssimo do dorso).'
  },
  abdominal: {
    id: 'abdominal',
    name: 'Abdominal',
    view: 'front',
    x: 118,
    y: 206,
    direction: 'Vertical (paralela ao eixo longitudinal do corpo)',
    location:
      'A 2 cm (ou 3 cm conforme padronização) lateralmente à direita da cicatriz umbilical, na mesma linha horizontal do umbigo.',
    technique:
      'Com a musculatura abdominal relaxada e respiração normal, destaque a prega verticalmente. Evite aprofundar demais os dedos para não pinçar a fáscia do reto abdominal.',
    commonErrors:
      'Pinçar longe demais do umbigo ou solicitar contração abdominal durante a medição.'
  },
  supra_iliaca: {
    id: 'supra_iliaca',
    name: 'Supra-ilíaca (Crista Ilíaca)',
    view: 'front',
    x: 87,
    y: 222,
    direction: 'Oblíqua / Diagonal (acompanhando o ângulo natural da crista ilíaca, ~45°)',
    location:
      'Imediatamente superior à crista ilíaca, na intersecção com a linha axilar anterior (logo acima da borda superior do osso ilíaco).',
    technique:
      'Palpe a crista ilíaca superior, marque 1–2 cm acima dela na linha axilar anterior e destaque a dobra obliquamente para baixo e medialmente.',
    commonErrors:
      'Confundir a dobra supra-ilíaca (linha axilar anterior) com a dobra supra-espinal ou pinçar na vertical.'
  },
  coxa: {
    id: 'coxa',
    name: 'Coxa Medial (Anterior)',
    view: 'front',
    x: 112,
    y: 306,
    direction: 'Vertical (paralela ao eixo longitudinal do fêmur)',
    location:
      'Face anterior da coxa direita, no ponto médio exato entre a prega inguinal (ligamento inguinal) e a borda proximal (superior) da patela.',
    technique:
      'O avaliado deve transferir o peso corporal para a perna esquerda, mantendo a perna direita relaxada com leve flexão de joelho. Se a dobra for muito firme, peça ao avaliado para sustentar a parte posterior da coxa com ambas as mãos.',
    commonErrors:
      'Medir com o quadríceps contraído ou medir próximo demais ao joelho.'
  },
  triceps: {
    id: 'triceps',
    name: 'Tricipital (Tríceps)',
    view: 'back',
    x: 186,
    y: 162,
    direction: 'Vertical (paralela ao eixo longitudinal do úmero)',
    location:
      'Face posterior do braço direito, no ponto médio exato entre o processo acromial da escápula (acrômio) e o processo do olécrano da ulna (cotovelo), medido com o cotovelo flexionado a 90° e depois relaxado.',
    technique:
      'Com o braço relaxado e estendido ao lado do tronco (palma voltada para a coxa), destaque a prega verticalmente na linha média posterior do braço, separando-a do ventre muscular do tríceps braquial.',
    commonErrors:
      'Não medir o ponto médio com fita métrica (olhômetro tende a errar para cima) ou pinçar o músculo tríceps junto.'
  },
  subescapular: {
    id: 'subescapular',
    name: 'Subescapular',
    view: 'back',
    x: 146,
    y: 150,
    direction: 'Diagonal (~45° para baixo e lateralmente, seguindo a borda medial da escápula)',
    location:
      '1 a 2 cm abaixo do ângulo inferior da escápula direita.',
    technique:
      'Caso o ângulo inferior da escápula não esteja visível, peça ao avaliado para colocar o braço direito atrás das costas para destacar a escápula, marque o ponto e retorne o braço à posição relaxada antes de pinçar.',
    commonErrors:
      'Pinçar na vertical em vez de seguir a angulação natural de 45° das linhas de clivagem da pele.'
  }
};

const SKINFOLD_PROTOCOLS = {
  jp3_male: {
    id: 'jp3_male',
    name: 'Jackson & Pollock — 3 Dobras (Masculino)',
    sex: 'male',
    sites: ['peitoral', 'abdominal', 'coxa'],
    description: 'Padrão-ouro clínico rápido para homens adultos (Peitoral + Abdominal + Coxa).'
  },
  jp3_female: {
    id: 'jp3_female',
    name: 'Jackson & Pollock — 3 Dobras (Feminino)',
    sex: 'female',
    sites: ['triceps', 'supra_iliaca', 'coxa'],
    description: 'Padrão-ouro clínico rápido para mulheres adultas (Tríceps + Supra-ilíaca + Coxa).'
  },
  jp7_all: {
    id: 'jp7_all',
    name: 'Jackson & Pollock — 7 Dobras (Completo)',
    sex: 'both',
    sites: ['peitoral', 'axilar_media', 'triceps', 'subescapular', 'abdominal', 'supra_iliaca', 'coxa'],
    description:
      'Avaliação antropométrica completa de 7 sítios (Peitoral, Axilar Média, Tríceps, Subescapular, Abdominal, Supra-ilíaca e Coxa).'
  }
};

function calculateSkinfoldResults({ protocolId, sex, age, weightKg, folds }) {
  const proto = SKINFOLD_PROTOCOLS[protocolId] || SKINFOLD_PROTOCOLS.jp3_male;
  const safeAge = Math.max(15, Math.min(90, Number(age) || 30));
  const safeWeight = Math.max(30, Number(weightKg) || 80);

  const sum = proto.sites.reduce((acc, siteKey) => acc + Math.max(0, Number(folds[siteKey]) || 0), 0);
  const allFilled = proto.sites.every((siteKey) => Number(folds[siteKey]) > 0);

  if (!allFilled || sum <= 0) {
    return {
      isValid: false,
      sum: Number(sum.toFixed(1)),
      density: null,
      bodyFatPct: null,
      fatMassKg: null,
      leanMassKg: null,
      classification: 'Preencha todas as dobras do protocolo'
    };
  }

  let density = 1.08;
  if (protocolId === 'jp3_male') {
    density =
      1.10938 -
      0.0008267 * sum +
      0.0000016 * (sum * sum) -
      0.0002574 * safeAge;
  } else if (protocolId === 'jp3_female') {
    density =
      1.0994921 -
      0.0009929 * sum +
      0.0000023 * (sum * sum) -
      0.0001392 * safeAge;
  } else {
    if (sex === 'female') {
      density =
        1.097 -
        0.00046971 * sum +
        0.00000056 * (sum * sum) -
        0.00012828 * safeAge;
    } else {
      density =
        1.112 -
        0.00043499 * sum +
        0.00000055 * (sum * sum) -
        0.00028826 * safeAge;
    }
  }

  // Equação de Siri (1961)
  const rawBf = (4.95 / Math.max(0.95, density) - 4.5) * 100;
  const bodyFatPct = Number(Math.max(3.0, Math.min(55.0, rawBf)).toFixed(1));
  const fatMassKg = Number(((safeWeight * bodyFatPct) / 100).toFixed(1));
  const leanMassKg = Number((safeWeight - fatMassKg).toFixed(1));

  let classification = 'Adequado / Eutrófico';
  if (sex === 'male') {
    if (bodyFatPct < 6) classification = 'Gordura Essencial (Muito Baixo)';
    else if (bodyFatPct <= 13) classification = 'Atlético / Excelente';
    else if (bodyFatPct <= 17) classification = 'Bom / Boa Forma';
    else if (bodyFatPct <= 24) classification = 'Média Populacional / Aceitável';
    else classification = 'Elevado / Sobrepeso Adiposo';
  } else {
    if (bodyFatPct < 14) classification = 'Gordura Essencial (Muito Baixo)';
    else if (bodyFatPct <= 20) classification = 'Atlético / Excelente';
    else if (bodyFatPct <= 24) classification = 'Bom / Boa Forma';
    else if (bodyFatPct <= 31) classification = 'Média Populacional / Aceitável';
    else classification = 'Elevado / Sobrepeso Adiposo';
  }

  return {
    isValid: true,
    sum: Number(sum.toFixed(1)),
    density: Number(density.toFixed(4)),
    bodyFatPct,
    fatMassKg,
    leanMassKg,
    classification
  };
}

// ============================================================================
// 3. BASE NUTRICIONAL EXPANDIDA & CICLO CALÓRICO
// ============================================================================
const FOOD_DATABASE = [
  { id: 'arroz_branco', name: 'Arroz Branco Cozido', group: 'carbs', kcal: 128, protein: 2.5, carbs: 28.1, fat: 0.2 },
  { id: 'arroz_integral', name: 'Arroz Integral Cozido', group: 'carbs', kcal: 124, protein: 2.6, carbs: 25.8, fat: 1.0 },
  { id: 'batata_doce', name: 'Batata Doce Cozida', group: 'carbs', kcal: 77, protein: 0.6, carbs: 18.4, fat: 0.1 },
  { id: 'batata_inglesa', name: 'Batata Inglesa Cozida', group: 'carbs', kcal: 52, protein: 1.2, carbs: 11.9, fat: 0.1 },
  { id: 'mandioca', name: 'Mandioca / Aipim Cozido', group: 'carbs', kcal: 125, protein: 0.6, carbs: 30.1, fat: 0.3 },
  { id: 'macarrao', name: 'Macarrão Cozido', group: 'carbs', kcal: 157, protein: 5.8, carbs: 30.9, fat: 0.9 },
  { id: 'aveia', name: 'Aveia em Flocos', group: 'carbs', kcal: 394, protein: 13.9, carbs: 66.6, fat: 8.5 },
  { id: 'pao_integral', name: 'Pão Integral', group: 'carbs', kcal: 253, protein: 9.4, carbs: 49.9, fat: 3.7 },
  { id: 'torrada_integral', name: 'Torrada Integral', group: 'carbs', kcal: 375, protein: 12.0, carbs: 68.0, fat: 5.5 },
  { id: 'tapioca', name: 'Goma de Tapioca Hidratada', group: 'carbs', kcal: 240, protein: 0.0, carbs: 60.0, fat: 0.0 },
  { id: 'banana', name: 'Banana Prata / Nanica', group: 'carbs', kcal: 92, protein: 1.3, carbs: 23.8, fat: 0.1 },
  { id: 'maca', name: 'Maçã Fuji com Casca', group: 'carbs', kcal: 56, protein: 0.3, carbs: 15.2, fat: 0.0 },
  { id: 'doce_leite', name: 'Doce de Leite Pastoso', group: 'carbs', kcal: 306, protein: 5.5, carbs: 59.5, fat: 5.2 },
  { id: 'mel', name: 'Mel de Abelha', group: 'carbs', kcal: 309, protein: 0.0, carbs: 84.0, fat: 0.0 },

  { id: 'frango', name: 'Peito de Frango Grelhado', group: 'protein', kcal: 159, protein: 32.0, carbs: 0.0, fat: 2.5 },
  { id: 'patinho', name: 'Patinho Bovino Moído/Grelhado', group: 'protein', kcal: 219, protein: 35.9, carbs: 0.0, fat: 7.3 },
  { id: 'tilapia', name: 'Filé de Tilápia Grelhado', group: 'protein', kcal: 128, protein: 26.2, carbs: 0.0, fat: 2.7 },
  { id: 'salmao', name: 'Salmão Grelhado', group: 'protein', kcal: 243, protein: 26.1, carbs: 0.0, fat: 14.6 },
  { id: 'ovos', name: 'Ovo Inteiro Cozido/Mexido', group: 'protein', kcal: 146, protein: 13.3, carbs: 0.6, fat: 9.5 },
  { id: 'clara_ovo', name: 'Clara de Ovo Pasteurizada/Cozida', group: 'protein', kcal: 52, protein: 10.9, carbs: 0.7, fat: 0.2 },
  { id: 'whey', name: 'Whey Protein Concentrado (80%)', group: 'protein', kcal: 400, protein: 80.0, carbs: 8.0, fat: 5.0 },
  { id: 'iogurte_natural', name: 'Iogurte Natural Integral/Desnatado', group: 'protein', kcal: 61, protein: 4.5, carbs: 5.5, fat: 2.2 },
  { id: 'queijo_minas', name: 'Queijo Minas Frescal', group: 'protein', kcal: 264, protein: 17.4, carbs: 3.2, fat: 20.2 },
  { id: 'queijo_mussarela', name: 'Queijo Mussarela', group: 'protein', kcal: 330, protein: 22.6, carbs: 3.0, fat: 25.2 },
  { id: 'queijo_cottage', name: 'Queijo Cottage', group: 'protein', kcal: 98, protein: 11.1, carbs: 3.4, fat: 4.3 },

  { id: 'azeite', name: 'Azeite de Oliva Extra Virgem', group: 'fat', kcal: 884, protein: 0.0, carbs: 0.0, fat: 100.0 },
  { id: 'amendoim', name: 'Amendoim Torrado sem Pele', group: 'fat', kcal: 567, protein: 25.8, carbs: 16.1, fat: 49.2 },
  { id: 'pasta_amendoim', name: 'Pasta de Amendoim Integral', group: 'fat', kcal: 588, protein: 25.0, carbs: 20.0, fat: 50.0 },
  { id: 'castanha_para', name: 'Castanha-do-Pará', group: 'fat', kcal: 643, protein: 14.5, carbs: 15.1, fat: 63.5 },
  { id: 'abacate', name: 'Abacate Fresco', group: 'fat', kcal: 96, protein: 1.2, carbs: 6.0, fat: 8.4 },
  { id: 'manteiga', name: 'Manteiga sem Sal', group: 'fat', kcal: 726, protein: 0.4, carbs: 0.0, fat: 82.4 }
];

const WEEK_DAYS = [
  { id: 'seg', short: 'Seg', label: 'Segunda-feira' },
  { id: 'ter', short: 'Ter', label: 'Terça-feira' },
  { id: 'qua', short: 'Qua', label: 'Quarta-feira' },
  { id: 'qui', short: 'Qui', label: 'Quinta-feira' },
  { id: 'sex', short: 'Sex', label: 'Sexta-feira' },
  { id: 'sab', short: 'Sáb', label: 'Sábado' },
  { id: 'dom', short: 'Dom', label: 'Domingo' }
];

const DAY_TYPE_CONFIG = {
  rest: { label: 'Low Carb / Descanso', carbsGKg: 1.4, color: '#38bdf8', bg: 'bg-sky-500/15 text-sky-300 border-sky-400/30' },
  moderate: { label: 'Treino Moderado', carbsGKg: 2.5, color: '#14b8a6', bg: 'bg-teal-500/15 text-teal-300 border-teal-400/30' },
  heavy: { label: 'Treino Pesado', carbsGKg: 3.6, color: '#00e5ff', bg: 'bg-cyan-500/15 text-cyan-200 border-cyan-400/30' },
  refeed: { label: 'Refeed / High Carb', carbsGKg: 4.8, color: '#a78bfa', bg: 'bg-violet-500/15 text-violet-200 border-violet-400/30' }
};

// ============================================================================
// 4. PERFIS PRÉ-CONFIGURADOS & PERSISTÊNCIA LOCALSTORAGE
// ============================================================================
const PRESET_PROFILES = {
  caso_padrao: {
    id: 'caso_padrao',
    label: 'Caso Padrão (10 Semanas)',
    userName: 'Paciente Caso #01 — Estudo 10 Semanas',
    goalLabel: 'Recomposição & Controle Metabólico',
    sex: 'male',
    age: 34,
    startWeight: 86.0,
    targetWeight: 77.5,
    heightCm: 177,
    agents: [
      { id: 'ag_1', drugId: 'tirzepatida', dose: 5.0, freqDays: 7, startWeek: 1 },
      { id: 'ag_2', drugId: 'durateston', dose: 250, freqDays: 14, startWeek: 1 }
    ],
    folds: {
      peitoral: 11.5,
      axilar_media: 12.0,
      triceps: 10.5,
      subescapular: 15.0,
      abdominal: 21.0,
      supra_iliaca: 16.5,
      coxa: 14.0
    },
    records: [
      { id: 'r1', date: '2026-09-07', week: 1, weight: 86.0, bodyFat: 19.8, rhr: 69, chest: 105.0, waist: 91.0, abdomen: 94.0, hip: 101.5, armR: 37.8, armL: 37.5, thighR: 59.5, thighL: 59.2, source: 'Adipômetro JP3', note: 'Avaliação Basal (Sem 1)' },
      { id: 'r2', date: '2026-09-28', week: 4, weight: 83.4, bodyFat: 17.9, rhr: 65, chest: 104.2, waist: 87.5, abdomen: 90.0, hip: 99.5, armR: 37.6, armL: 37.4, thighR: 58.6, thighL: 58.4, source: 'Adipômetro JP3', note: 'Titulação Sem 4' },
      { id: 'r3', date: '2026-10-19', week: 7, weight: 81.1, bodyFat: 16.1, rhr: 62, chest: 103.6, waist: 84.4, abdomen: 86.5, hip: 97.8, armR: 37.5, armL: 37.3, thighR: 58.0, thighL: 57.8, source: 'Adipômetro JP3', note: 'Steady-State Sem 7' },
      { id: 'r4', date: '2026-11-09', week: 10, weight: 79.2, bodyFat: 14.6, rhr: 59, chest: 103.2, waist: 81.8, abdomen: 83.6, hip: 96.4, armR: 37.5, armL: 37.3, thighR: 57.6, thighL: 57.5, source: 'Adipômetro JP3', note: 'Fechamento Sem 10' }
    ]
  },
  recomposicao: {
    id: 'recomposicao',
    label: 'Recomposição Corporal (TRT + Dieta)',
    userName: 'Atleta Recreacional — Recomposição',
    goalLabel: 'Hipertrofia & Definição Muscular',
    sex: 'male',
    age: 38,
    startWeight: 82.0,
    targetWeight: 80.0,
    heightCm: 175,
    agents: [
      { id: 'ag_r1', drugId: 'cipionato_testosterona', dose: 100, freqDays: 7, startWeek: 1 }
    ],
    folds: {
      peitoral: 8.5,
      axilar_media: 9.0,
      triceps: 8.0,
      subescapular: 12.0,
      abdominal: 15.5,
      supra_iliaca: 12.5,
      coxa: 11.0
    },
    records: [
      { id: 'rr1', date: '2026-09-01', week: 1, weight: 82.0, bodyFat: 16.2, rhr: 64, chest: 104.0, waist: 84.5, abdomen: 86.5, hip: 98.0, armR: 38.2, armL: 38.0, thighR: 59.0, thighL: 58.8, source: 'Adipômetro JP7', note: 'Início do bloco' },
      { id: 'rr2', date: '2026-10-01', week: 5, weight: 81.4, bodyFat: 14.3, rhr: 61, chest: 104.8, waist: 82.0, abdomen: 83.8, hip: 97.2, armR: 38.7, armL: 38.5, thighR: 59.5, thighL: 59.3, source: 'Adipômetro JP7', note: 'Ganho magro + queda BF' },
      { id: 'rr3', date: '2026-11-01', week: 9, weight: 80.9, bodyFat: 12.6, rhr: 59, chest: 105.5, waist: 79.8, abdomen: 81.4, hip: 96.5, armR: 39.1, armL: 38.9, thighR: 60.0, thighL: 59.8, source: 'Adipômetro JP7', note: 'Pico de definição' }
    ]
  },
  metabolico: {
    id: 'metabolico',
    label: 'Protocolo Clínico Metabólico',
    userName: 'Paciente Clínico #03 — Síndrome Metabólica',
    goalLabel: 'Controle Glicêmico, Lipídico & Redução Visceral',
    sex: 'female',
    age: 45,
    startWeight: 78.5,
    targetWeight: 67.0,
    heightCm: 164,
    agents: [
      { id: 'ag_m1', drugId: 'semaglutida', dose: 1.0, freqDays: 7, startWeek: 1 },
      { id: 'ag_m2', drugId: 'metformina_xr', dose: 1000, freqDays: 1, startWeek: 1 },
      { id: 'ag_m3', drugId: 'estatina_alta_potencia', dose: 10, freqDays: 1, startWeek: 1 }
    ],
    folds: {
      peitoral: 14.0,
      axilar_media: 16.0,
      triceps: 19.5,
      subescapular: 18.0,
      abdominal: 24.0,
      supra_iliaca: 21.0,
      coxa: 24.5
    },
    records: [
      { id: 'rm1', date: '2026-08-15', week: 1, weight: 78.5, bodyFat: 31.4, rhr: 74, chest: 98.0, waist: 88.0, abdomen: 93.0, hip: 106.0, armR: 32.5, armL: 32.3, thighR: 61.0, thighL: 60.8, source: 'Adipômetro JP3', note: 'Avaliação inicial' },
      { id: 'rm2', date: '2026-09-26', week: 6, weight: 74.2, bodyFat: 28.6, rhr: 69, chest: 95.5, waist: 83.5, abdomen: 88.0, hip: 103.0, armR: 31.5, armL: 31.4, thighR: 59.2, thighL: 59.0, source: 'Adipômetro JP3', note: 'Semana 6 — melhora glicêmica' },
      { id: 'rm3', date: '2026-11-07', week: 12, weight: 70.6, bodyFat: 25.8, rhr: 65, chest: 93.2, waist: 79.8, abdomen: 84.0, hip: 100.2, armR: 30.8, armL: 30.7, thighR: 57.6, thighL: 57.5, source: 'Adipômetro JP3', note: 'Semana 12 — redução visceral' }
    ]
  }
};

const STORAGE_KEY = 'nexus_protocol_hierarchical_v7';

function buildStateFromPreset(presetKey = 'caso_padrao') {
  const p = PRESET_PROFILES[presetKey] || PRESET_PROFILES.caso_padrao;
  return {
    activePresetId: p.id,
    profile: {
      appTitle: 'NexusProtocol',
      userName: p.userName,
      goalLabel: p.goalLabel,
      sex: p.sex,
      age: p.age,
      startWeight: p.startWeight,
      targetWeight: p.targetWeight,
      heightCm: p.heightCm
    },
    skinfold: {
      protocolId: p.sex === 'female' ? 'jp3_female' : 'jp3_male',
      selectedSiteId: p.sex === 'female' ? 'triceps' : 'peitoral',
      folds: { ...p.folds }
    },
    clinicalStudy: {
      horizonWeeks: 12,
      selectedCategory: 'all',
      searchQuery: '',
      selectedEncyclopediaDrugId: p.agents[0]?.drugId || 'semaglutida',
      agents: p.agents.map((a) => ({ ...a }))
    },
    nutrition: {
      selectedDayId: 'qua',
      proteinGKg: 2.1,
      fatGKg: 0.75,
      dayTypes: {
        seg: 'rest',
        ter: 'moderate',
        qua: 'heavy',
        qui: 'rest',
        sex: 'heavy',
        sab: 'refeed',
        dom: 'rest'
      }
    },
    mealPlan: [
      {
        id: 'm_cafe',
        name: 'Café da Manhã',
        time: '07:30',
        items: [
          { id: 'i1', foodId: 'ovos', grams: 150 },
          { id: 'i2', foodId: 'torrada_integral', grams: 40 },
          { id: 'i3', foodId: 'queijo_minas', grams: 40 }
        ]
      },
      {
        id: 'm_almoco',
        name: 'Almoço',
        time: '12:30',
        items: [
          { id: 'i4', foodId: 'frango', grams: 180 },
          { id: 'i5', foodId: 'arroz_branco', grams: 160 },
          { id: 'i6', foodId: 'azeite', grams: 10 }
        ]
      },
      {
        id: 'm_tarde',
        name: 'Lanche / Pré-Treino',
        time: '16:30',
        items: [
          { id: 'i7', foodId: 'iogurte_natural', grams: 170 },
          { id: 'i8', foodId: 'whey', grams: 30 },
          { id: 'i9', foodId: 'doce_leite', grams: 20 }
        ]
      },
      {
        id: 'm_jantar',
        name: 'Pós-Treino / Jantar',
        time: '20:00',
        items: [
          { id: 'i10', foodId: 'patinho', grams: 170 },
          { id: 'i11', foodId: 'batata_inglesa', grams: 220 }
        ]
      },
      {
        id: 'm_ceia',
        name: 'Ceia',
        time: '22:30',
        items: [
          { id: 'i12', foodId: 'queijo_cottage', grams: 100 },
          { id: 'i13', foodId: 'amendoim', grams: 15 }
        ]
      }
    ],
    records: p.records.map((r) => ({ ...r })),
    equivalence: {
      group: 'carbs',
      mode: 'macro',
      baseFoodId: 'arroz_branco',
      baseGrams: 150,
      targetFoodId: 'batata_inglesa'
    }
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.profile && parsed.clinicalStudy && parsed.nutrition && parsed.records && parsed.skinfold) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Falha ao ler localStorage:', e);
  }
  return buildStateFromPreset('caso_padrao');
}

// ============================================================================
// 5. MOTOR MATEMÁTICO DE SIMULAÇÃO FARMACOCINÉTICA MULTI-AGENTE & MULTI-ÉSTER
// ============================================================================
function simulateMultiAgentPK(agents, horizonWeeks = 12) {
  const safeWeeks = Math.min(24, Math.max(4, Number(horizonWeeks) || 12));
  const totalDays = safeWeeks * 7;
  const step = 0.25;
  const daysAxis = [];
  for (let t = 0; t <= totalDays; t += step) {
    daysAxis.push(Number(t.toFixed(2)));
  }

  const series = agents.map((ag) => {
    const drug = REGULATED_DRUGS.find((d) => d.id === ag.drugId) || REGULATED_DRUGS[0];
    const freqDays = Math.max(0.25, Number(ag.freqDays) || drug.defaultFreqDays);
    const startDay = Math.max(0, ((Number(ag.startWeek) || 1) - 1) * 7);
    const dose = Math.max(0, Number(ag.dose) || 0);

    const doseTimes = [];
    for (let d = startDay; d < totalDays; d += freqDays) {
      doseTimes.push(d);
    }

    let rawPoints = [];
    if (drug.isMultiEster && Array.isArray(drug.esters)) {
      const esterCurves = drug.esters.map((est) => {
        const keEst = Math.LN2 / Math.max(0.15, est.halfLifeDays);
        const kaEst = est.ka || 2.5;
        const estDose = dose * est.fraction;
        return daysAxis.map((t) => {
          let sum = 0;
          for (let i = 0; i < doseTimes.length; i++) {
            const dt = t - doseTimes[i];
            if (dt >= 0 && estDose > 0) {
              const factor =
                Math.abs(kaEst - keEst) > 0.005
                  ? (kaEst / (kaEst - keEst)) * (Math.exp(-keEst * dt) - Math.exp(-kaEst * dt))
                  : Math.exp(-keEst * dt);
              sum += estDose * Math.max(0, factor);
            }
          }
          return sum;
        });
      });
      rawPoints = daysAxis.map((_, idx) =>
        esterCurves.reduce((acc, curve) => acc + curve[idx], 0)
      );
    } else {
      const halfLifeDays = Math.max(0.08, drug.halfLifeDays);
      const ke = Math.LN2 / halfLifeDays;
      const ka = drug.isOral ? 6.0 : 2.6;
      rawPoints = daysAxis.map((t) => {
        let conc = 0;
        for (let i = 0; i < doseTimes.length; i++) {
          const dt = t - doseTimes[i];
          if (dt >= 0 && dose > 0) {
            const factor =
              Math.abs(ka - ke) > 0.005
                ? (ka / (ka - ke)) * (Math.exp(-ke * dt) - Math.exp(-ka * dt))
                : Math.exp(-ke * dt);
            conc += dose * Math.max(0, factor);
          }
        }
        return conc;
      });
    }

    const peakConc = Math.max(0.0001, ...rawPoints);
    const normalizedPoints = rawPoints.map((val) => Number(((val / peakConc) * 100).toFixed(2)));
    const effectiveHalfLife = drug.isMultiEster ? 10.0 : drug.halfLifeDays;
    const steadyStateDays = Number((effectiveHalfLife * 4.5).toFixed(1));
    const steadyStateWeek = Number((steadyStateDays / 7).toFixed(1));

    return {
      agentId: ag.id,
      drug,
      dose,
      freqDays,
      startWeek: ag.startWeek,
      peakConc: Number(peakConc.toFixed(2)),
      steadyStateDays,
      steadyStateWeek,
      rawPoints,
      normalizedPoints
    };
  });

  const combinedPoints = daysAxis.map((_, idx) => {
    if (!series.length) return 0;
    const sum = series.reduce((acc, s) => acc + s.normalizedPoints[idx], 0);
    return Number((sum / series.length).toFixed(2));
  });

  // Detector Inteligente de Interações e Sobreposição Clínica
  const alerts = [];
  const activeDrugs = series.map((s) => s.drug);
  const ids = activeDrugs.map((d) => d.id);
  const incretins = activeDrugs.filter((d) => d.isIncretin);
  const androgens = activeDrugs.filter((d) => d.category === 'hormonios');
  const thyroids = activeDrugs.filter((d) => d.category === 'tireoide');
  const oralDrugs = activeDrugs.filter((d) => d.isOral);

  if (incretins.length >= 2) {
    alerts.push({
      level: 'high',
      title: 'Duplicidade de Classe (Agonistas GLP-1 / GIP)',
      text: `Você associou ${incretins.map((d) => `${d.name} (${d.brandNames})`).join(' + ')}. Na prática clínica regulamentada, agonistas de GLP-1/GIP não são combinados entre si devido à competição pelo mesmo receptor e risco elevado de náuseas graves e gastroparesia.`
    });
  }
  if (androgens.length >= 2) {
    alerts.push({
      level: 'high',
      title: 'Associação de Múltiplas Formulações de Testosterona',
      text: `Você selecionou ${androgens.map((d) => `${d.name} (${d.brandNames})`).join(' + ')}. Em protocolos de TRT regulamentados utiliza-se uma única formulação para titular dose e monitorar hematócrito (>52%) e estradiol sem somatório imprevisível.`
    });
  }
  if (incretins.length >= 1 && oralDrugs.length > 0) {
    alerts.push({
      level: 'medium',
      title: 'Retardo do Esvaziamento Gástrico vs. Absorção Oral',
      text: `Agonistas incretínicos retardam o esvaziamento gástrico, podendo alterar a absorção de ${oralDrugs.map((d) => d.name).join(', ')}. Em uso de Levotiroxina ("Puran T4"), manter jejum rigoroso de 45–60 min e reavaliar TSH após 6 semanas.`
    });
  }
  if (incretins.length >= 1 && ids.includes('metformina_xr')) {
    alerts.push({
      level: 'info',
      title: 'Associação Sinérgica Documentada (Incretina + Metformina)',
      text: 'Combinação validada nos ensaios SUSTAIN e SURPASS: sensibilização hepática via AMPK + resposta incretínica sem risco de hipoglicemia.'
    });
  }
  if (incretins.length >= 1 && ids.includes('inibidor_sglt2')) {
    alerts.push({
      level: 'medium',
      title: 'Sinergia Cardiorrenal + Vigilância de Hidratação e Cetonemia',
      text: 'Forte proteção cardiorrenal, mas requer atenção à hidratação diária e prevenção de cetoacidose euglicêmica em dietas muito baixas em carboidratos.'
    });
  }
  if (androgens.length >= 1 && ids.includes('liotironina')) {
    alerts.push({
      level: 'medium',
      title: 'Sobrecarga Cronotrópica & Cardiovascular (Testosterona + T3)',
      text: 'Associação pode potencializar aumento da frequência cardíaca de repouso, pressão arterial e consumo miocárdico de oxigênio.'
    });
  }
  if (ids.includes('orlistate') && ids.includes('levotiroxina')) {
    alerts.push({
      level: 'high',
      title: 'Interação de Absorção Intestinal (Orlistate + Levotiroxina)',
      text: 'O Orlistate ("Xenical") reduz a absorção intestinal de Levotiroxina. Espaçar administrações em pelo menos 4 horas.'
    });
  }
  if (ids.includes('durateston')) {
    alerts.push({
      level: 'info',
      title: 'Perfil Bifásico Multi-Éster ("Durateston" / "Sustanon 250")',
      text: 'O Propionato (30mg) gera pico rápido em 24–48h, enquanto o Decanoato (100mg) sustenta a cauda por até 14–21 dias.'
    });
  }
  if (thyroids.length >= 2) {
    alerts.push({
      level: 'medium',
      title: 'Terapia Combinada T4 + T3',
      text: 'Exige ajuste fino da dose de T4 para evitar hipertireoidismo subclínico, monitorando T3 livre, T4 livre, TSH e FCR.'
    });
  }

  return { daysAxis, totalDays, safeWeeks, series, combinedPoints, alerts };
}

// ============================================================================
// 6. COMPONENTES VISUAIS SVG (MAPA ANATÔMICO & GRÁFICOS INTERATIVOS)
// ============================================================================
function AnatomicalSkinfoldMapSVG({ activeSites, selectedSiteId, onSelectSite }) {
  const frontSites = Object.values(SKINFOLD_SITES).filter((s) => s.view === 'front');
  const backSites = Object.values(SKINFOLD_SITES).filter((s) => s.view === 'back');

  const renderPin = (site) => {
    const isInProtocol = activeSites.includes(site.id);
    const isSelected = selectedSiteId === site.id;

    return (
      <g
        key={site.id}
        onClick={() => onSelectSite(site.id)}
        className="cursor-pointer transition-transform duration-200"
      >
        {isSelected && (
          <circle
            cx={site.x}
            cy={site.y}
            r="14"
            fill="none"
            stroke="#00e5ff"
            strokeWidth="1.8"
            strokeDasharray="3 2"
          />
        )}
        <circle
          cx={site.x}
          cy={site.y}
          r={isSelected ? '7.5' : isInProtocol ? '6' : '4.5'}
          fill={isSelected ? '#00e5ff' : isInProtocol ? '#14b8a6' : '#475569'}
          stroke="#060d1f"
          strokeWidth="2"
        />
        <text
          x={site.x + (site.x > 160 ? -10 : 10)}
          y={site.y + 4}
          textAnchor={site.x > 160 ? 'end' : 'start'}
          fill={isSelected ? '#00e5ff' : isInProtocol ? '#e2e8f0' : '#64748b'}
          fontSize="8.5"
          fontWeight={isSelected || isInProtocol ? 'bold' : 'normal'}
        >
          {site.name.split(' ')[0]}
        </text>
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 280 415" className="h-auto w-full max-w-[320px] select-none">
        <defs>
          <linearGradient id="bodySilhouetteGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#102952" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#08152e" stopOpacity="0.98" />
          </linearGradient>
        </defs>

        <text x="102" y="18" textAnchor="middle" fill="#00e5ff" fontSize="10" fontWeight="bold">
          VISTA FRONTAL
        </text>
        <text x="176" y="18" textAnchor="middle" fill="#14b8a6" fontSize="10" fontWeight="bold">
          VISTA DORSAL
        </text>

        {/* SILHUETA FRONTAL */}
        <g stroke="#1e3a6e" strokeWidth="1.5" fill="url(#bodySilhouetteGrad)">
          <circle cx="102" cy="48" r="18" />
          <path d="M 94 65 L 94 78 L 110 78 L 110 65 Z" />
          <path d="M 66 86 Q 102 76 138 86 L 146 188 L 135 190 L 130 118 L 128 228 L 134 388 L 114 388 L 105 256 L 99 256 L 90 388 L 70 388 L 76 228 L 74 118 L 69 190 L 58 188 Z" />
          <line x1="102" y1="84" x2="102" y2="232" stroke="#1e3a6e" strokeDasharray="2 3" />
          <path d="M 80 128 Q 91 136 102 128 Q 113 136 124 128" fill="none" stroke="#1e3a6e" />
        </g>

        {/* SILHUETA DORSAL */}
        <g stroke="#1e3a6e" strokeWidth="1.5" fill="url(#bodySilhouetteGrad)">
          <circle cx="176" cy="48" r="18" />
          <path d="M 168 65 L 168 78 L 184 78 L 184 65 Z" />
          <path d="M 140 86 Q 176 76 212 86 L 220 188 L 209 190 L 204 118 L 202 228 L 208 388 L 188 388 L 179 256 L 173 256 L 164 388 L 144 388 L 150 228 L 148 118 L 143 190 L 132 188 Z" />
          <path d="M 152 108 L 164 112 L 158 148 Z" fill="none" stroke="#1e3a6e" />
          <path d="M 200 108 L 188 112 L 194 148 Z" fill="none" stroke="#1e3a6e" />
        </g>

        {frontSites.map(renderPin)}
        {backSites.map(renderPin)}
      </svg>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#00e5ff]" /> Prega Selecionada
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#14b8a6]" /> No Protocolo Ativo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-600" /> Outros Sítios
        </span>
      </div>
    </div>
  );
}

function IntegratedOverviewChartSVG({ records, clinicalSim }) {
  const [hoverWeek, setHoverWeek] = useState(null);

  const width = 760;
  const height = 265;
  const padL = 48;
  const padR = 48;
  const padT = 24;
  const padB = 34;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const maxWeek = Math.max(
    10,
    clinicalSim.safeWeeks || 12,
    ...records.map((r) => Number(r.week) || 1)
  );

  const weights = records.map((r) => Number(r.weight) || 80);
  const wMin = Math.min(...weights) - 2;
  const wMax = Math.max(...weights) + 2;
  const wSpan = Math.max(1, wMax - wMin);

  const bfs = records.filter((r) => r.bodyFat !== null && r.bodyFat !== undefined).map((r) => Number(r.bodyFat));
  const bfMin = bfs.length ? Math.min(...bfs) - 2 : 10;
  const bfMax = bfs.length ? Math.max(...bfs) + 2 : 30;
  const bfSpan = Math.max(1, bfMax - bfMin);

  const toX = (week) => padL + ((week - 1) / Math.max(1, maxWeek - 1)) * plotW;
  const toYW = (w) => padT + plotH - ((w - wMin) / wSpan) * plotH;
  const toYBf = (bf) => padT + plotH - ((bf - bfMin) / bfSpan) * plotH;
  const toYPk = (pct) => padT + plotH - (Math.min(100, Math.max(0, pct)) / 100) * plotH;

  const pkPath = useMemo(() => {
    if (!clinicalSim.daysAxis.length || !clinicalSim.series.length) return '';
    return clinicalSim.daysAxis
      .map((day, idx) => {
        const w = 1 + day / 7;
        const x = Math.min(padL + plotW, Math.max(padL, toX(w)));
        const y = toYPk(clinicalSim.combinedPoints[idx]);
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }, [clinicalSim, maxWeek]);

  const weightPath = records
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${toX(r.week || i + 1).toFixed(1)} ${toYW(r.weight).toFixed(1)}`)
    .join(' ');

  const bfRecords = records.filter((r) => r.bodyFat !== null && r.bodyFat !== undefined);
  const bfPath = bfRecords
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${toX(r.week || i + 1).toFixed(1)} ${toYBf(r.bodyFat).toFixed(1)}`)
    .join(' ');

  const weeksTicks = [];
  for (let w = 1; w <= maxWeek; w += maxWeek > 14 ? 2 : 1) {
    weeksTicks.push(w);
  }

  return (
    <div className="relative w-full select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full overflow-visible">
        {[0, 0.5, 1].map((f, i) => {
          const y = padT + plotH - f * plotH;
          const wVal = (wMin + f * wSpan).toFixed(1);
          const bfVal = (bfMin + f * bfSpan).toFixed(1);
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
              <text x={padL - 8} y={y + 4} textAnchor="end" fill="#00e5ff" fontSize="10">
                {wVal}kg
              </text>
              <text x={width - padR + 8} y={y + 4} textAnchor="start" fill="#14b8a6" fontSize="10">
                {bfVal}%
              </text>
            </g>
          );
        })}

        {weeksTicks.map((w) => (
          <text key={w} x={toX(w)} y={padT + plotH + 18} textAnchor="middle" fill="#94a3b8" fontSize="10">
            Sem {w}
          </text>
        ))}

        {pkPath && (
          <path d={pkPath} fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeDasharray="4 3" opacity="0.7" />
        )}

        {bfRecords.length > 1 && (
          <path d={bfPath} fill="none" stroke="#14b8a6" strokeWidth="2.4" strokeLinecap="round" />
        )}

        {records.length > 1 && (
          <path d={weightPath} fill="none" stroke="#00e5ff" strokeWidth="3" strokeLinecap="round" />
        )}

        {records.map((r, idx) => {
          const wk = r.week || idx + 1;
          const x = toX(wk);
          return (
            <g
              key={r.id || idx}
              className="cursor-pointer"
              onMouseEnter={() => setHoverWeek(idx)}
              onMouseLeave={() => setHoverWeek(null)}
            >
              <circle cx={x} cy={toYW(r.weight)} r="5" fill="#060d1f" stroke="#00e5ff" strokeWidth="2.5" />
              {r.bodyFat !== null && r.bodyFat !== undefined && (
                <circle cx={x} cy={toYBf(r.bodyFat)} r="4.5" fill="#060d1f" stroke="#14b8a6" strokeWidth="2.3" />
              )}
            </g>
          );
        })}

        {hoverWeek !== null && records[hoverWeek] && (() => {
          const r = records[hoverWeek];
          const x = toX(r.week || hoverWeek + 1);
          return (
            <g transform={`translate(${x > width - 210 ? x - 195 : x + 12}, ${padT + 4})`}>
              <rect width="185" height="62" rx="10" fill="#08152e" stroke="#00e5ff" strokeWidth="1.2" />
              <text x="10" y="17" fill="#94a3b8" fontSize="10" fontWeight="bold">
                Semana {r.week || hoverWeek + 1} ({r.date})
              </text>
              <text x="10" y="34" fill="#00e5ff" fontSize="11" fontWeight="bold">
                Peso: {r.weight} kg
              </text>
              <text x="10" y="50" fill="#14b8a6" fontSize="11" fontWeight="bold">
                % Gordura: {r.bodyFat ? `${r.bodyFat}%` : 'N/D'}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

function MultiAgentPKChartSVG({ simData }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const { daysAxis, totalDays, safeWeeks, series, combinedPoints } = simData;

  const width = 760;
  const height = 255;
  const padL = 46;
  const padR = 20;
  const padT = 20;
  const padB = 34;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const toX = (day) => padL + (day / Math.max(1, totalDays)) * plotW;
  const toY = (pct) => padT + plotH - (Math.min(105, Math.max(0, pct)) / 105) * plotH;

  const combinedPath = useMemo(() => {
    if (!daysAxis.length) return '';
    return daysAxis
      .map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${toX(d).toFixed(1)} ${toY(combinedPoints[idx]).toFixed(1)}`)
      .join(' ');
  }, [daysAxis, combinedPoints, totalDays]);

  const handleMouseMove = (e) => {
    if (!daysAxis.length) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * width;
    const targetDay = ((relX - padL) / plotW) * totalDays;
    let bestIdx = 0;
    let bestDiff = Infinity;
    for (let i = 0; i < daysAxis.length; i++) {
      const diff = Math.abs(daysAxis[i] - targetDay);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestIdx = i;
      }
    }
    setHoverIdx(bestIdx);
  };

  const yTicks = [0, 25, 50, 75, 100];
  const weekStep = safeWeeks <= 12 ? 1 : 2;
  const xTicks = [];
  for (let w = 0; w <= safeWeeks; w += weekStep) {
    xTicks.push({ label: `S${w}`, x: toX(w * 7) });
  }

  const activeDay = hoverIdx !== null ? daysAxis[hoverIdx] : null;

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full overflow-visible"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {yTicks.map((val) => {
          const y = toY(val);
          return (
            <g key={val}>
              <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="rgba(148, 163, 184, 0.14)" strokeDasharray="3 3" />
              <text x={padL - 8} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="10">
                {val}%
              </text>
            </g>
          );
        })}

        {xTicks.map((t, i) => (
          <g key={i}>
            <line x1={t.x} y1={padT} x2={t.x} y2={padT + plotH} stroke="rgba(148, 163, 184, 0.08)" />
            <text x={t.x} y={padT + plotH + 18} textAnchor="middle" fill="#94a3b8" fontSize="10">
              {t.label}
            </text>
          </g>
        ))}

        {series.length > 1 && (
          <path d={combinedPath} fill="none" stroke="#e2e8f0" strokeWidth="1.8" strokeDasharray="5 4" opacity="0.85" />
        )}

        {series.map((s) => {
          const dPath = daysAxis
            .map((day, idx) => `${idx === 0 ? 'M' : 'L'} ${toX(day).toFixed(1)} ${toY(s.normalizedPoints[idx]).toFixed(1)}`)
            .join(' ');
          return (
            <path key={s.agentId} d={dPath} fill="none" stroke={s.drug.color} strokeWidth="2.6" strokeLinecap="round" />
          );
        })}

        {activeDay !== null && hoverIdx !== null && (
          <g>
            <line x1={toX(activeDay)} y1={padT} x2={toX(activeDay)} y2={padT + plotH} stroke="#00e5ff" strokeWidth="1.2" strokeDasharray="4 3" />
            {series.map((s) => (
              <circle
                key={s.agentId}
                cx={toX(activeDay)}
                cy={toY(s.normalizedPoints[hoverIdx])}
                r="4.5"
                fill="#060d1f"
                stroke={s.drug.color}
                strokeWidth="2.5"
              />
            ))}
            <g transform={`translate(${toX(activeDay) > width - 235 ? toX(activeDay) - 225 : toX(activeDay) + 12}, ${padT + 4})`}>
              <rect width="215" height={34 + series.length * 17} rx="10" fill="#08152e" stroke="#00e5ff" strokeWidth="1" />
              <text x="10" y="17" fill="#94a3b8" fontSize="10" fontWeight="bold">
                Dia {activeDay} (Semana {Math.ceil((activeDay + 0.01) / 7)})
              </text>
              {series.map((s, idx) => (
                <text key={s.agentId} x="10" y={34 + idx * 17} fill={s.drug.color} fontSize="10.5" fontWeight="bold">
                  {s.drug.name.slice(0, 18)}: {s.normalizedPoints[hoverIdx].toFixed(0)}% ({s.rawPoints[hoverIdx].toFixed(1)}
                  {s.drug.unit})
                </text>
              ))}
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}

function MetricTrendSVG({ records, metricKey, label, unit, color = '#00e5ff' }) {
  const [hovered, setHovered] = useState(null);

  const validRecords = useMemo(
    () => records.filter((r) => r[metricKey] !== null && r[metricKey] !== undefined && !Number.isNaN(Number(r[metricKey]))),
    [records, metricKey]
  );

  const width = 640;
  const height = 210;
  const padL = 46;
  const padR = 24;
  const padT = 22;
  const padB = 34;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  if (!validRecords.length) {
    return (
      <div className="flex h-44 items-center justify-center rounded-xl border border-dashed border-cyan-500/20 text-xs text-slate-400">
        Sem registros numéricos para {label}.
      </div>
    );
  }

  const values = validRecords.map((r) => Number(r[metricKey]));
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const padVal = Math.max(0.5, (rawMax - rawMin) * 0.18);
  const minVal = rawMin - padVal;
  const maxVal = rawMax + padVal;
  const span = Math.max(0.1, maxVal - minVal);

  const pts = validRecords.map((r, idx) => {
    const val = Number(r[metricKey]);
    const x = validRecords.length === 1 ? padL + plotW / 2 : padL + (idx / (validRecords.length - 1)) * plotW;
    const y = padT + plotH - ((val - minVal) / span) * plotH;
    return { ...r, val, x, y };
  });

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${pts[pts.length - 1].x.toFixed(1)} ${(padT + plotH).toFixed(1)} L ${pts[0].x.toFixed(1)} ${(padT + plotH).toFixed(1)} Z`;

  const yTicks = [0, 0.5, 1].map((f) => ({
    val: (minVal + f * span).toFixed(1),
    y: padT + plotH - f * plotH
  }));

  const active = hovered !== null && pts[hovered] ? pts[hovered] : null;

  return (
    <div className="relative w-full select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full overflow-visible">
        <defs>
          <linearGradient id={`grad_${metricKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={padL} y1={t.y} x2={width - padR} y2={t.y} stroke="rgba(148,163,184,0.14)" strokeDasharray="3 3" />
            <text x={padL - 8} y={t.y + 4} textAnchor="end" fill="#94a3b8" fontSize="10">
              {t.val}
            </text>
          </g>
        ))}

        {pts.map((p, i) => (
          <text key={p.id || i} x={p.x} y={padT + plotH + 18} textAnchor="middle" fill="#94a3b8" fontSize="10">
            {p.date.slice(5)}
          </text>
        ))}

        <path d={areaPath} fill={`url(#grad_${metricKey})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" />

        {pts.map((p, idx) => (
          <g
            key={p.id || idx}
            className="cursor-pointer"
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setHovered(idx)}
          >
            <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
            <circle cx={p.x} cy={p.y} r={hovered === idx ? '6' : '4.2'} fill="#060d1f" stroke={color} strokeWidth="2.5" />
          </g>
        ))}

        {active && (
          <g transform={`translate(${active.x > width - 170 ? active.x - 160 : active.x + 10}, ${Math.max(padT, active.y - 34)})`}>
            <rect width="150" height="44" rx="8" fill="#08152e" stroke={color} strokeWidth="1.2" />
            <text x="10" y="17" fill="#94a3b8" fontSize="10">
              {active.date}
            </text>
            <text x="10" y="34" fill="#ffffff" fontSize="12" fontWeight="bold">
              {label}: {active.val.toFixed(1)} {unit}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

// ============================================================================
// 7. COMPONENTE PRINCIPAL: NEXUSPROTOCOL (NAVEGAÇÃO HIERÁRQUICA 2 NÍVEIS)
// ============================================================================
const NAVIGATION_MODULES = [
  {
    id: 'integrated',
    label: 'Visão Integrada',
    icon: Activity,
    subTabs: [{ id: 'overview', label: 'Painel Unificado & Cruzamento' }]
  },
  {
    id: 'nutrition',
    label: 'Nutrição & Dieta',
    icon: Utensils,
    subTabs: [
      { id: 'cycle', label: 'Ciclo Calórico & Refeed' },
      { id: 'mealplan', label: 'Cardápio Personalizado' },
      { id: 'equivalence', label: 'Equivalência Alimentar' }
    ]
  },
  {
    id: 'measures',
    label: 'Medidas & Adipômetro',
    icon: Ruler,
    subTabs: [
      { id: 'circumferences', label: 'Peso, FCR & Circunferências' },
      { id: 'skinfold', label: 'Adipômetro & Mapa Anatômico' }
    ]
  },
  {
    id: 'clinical',
    label: 'Clínica & Fármacos',
    icon: Stethoscope,
    subTabs: [
      { id: 'simulator', label: 'Simulador Farmacocinético (PK/PD)' },
      { id: 'encyclopedia', label: 'Bulário & Enciclopédia Clínica' }
    ]
  }
];

export default function App() {
  const [state, setState] = useState(loadState);
  const [activeModule, setActiveModule] = useState('integrated');
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [selectedMeasureMetric, setSelectedMeasureMetric] = useState('weight');
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().slice(0, 10),
    week: '',
    weight: '',
    bodyFat: '',
    rhr: '',
    chest: '',
    waist: '',
    abdomen: '',
    hip: '',
    armR: '',
    armL: '',
    thighR: '',
    thighL: '',
    note: ''
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Falha ao salvar localStorage:', e);
    }
  }, [state]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev && prev.message === message ? null : prev));
    }, 3400);
  };

  const handleSelectModule = (moduleId) => {
    setActiveModule(moduleId);
    const mod = NAVIGATION_MODULES.find((m) => m.id === moduleId);
    if (mod && mod.subTabs.length) {
      setActiveSubTab(mod.subTabs[0].id);
    }
  };

  const currentModuleObj =
    NAVIGATION_MODULES.find((m) => m.id === activeModule) || NAVIGATION_MODULES[0];

  const latestRecord = useMemo(() => {
    if (!state.records.length) {
      return { week: 1, weight: 80, bodyFat: 16, rhr: 62, waist: 84, abdomen: 86 };
    }
    return state.records[state.records.length - 1];
  }, [state.records]);

  const firstRecord = state.records[0] || latestRecord;

  const skinfoldResults = useMemo(
    () =>
      calculateSkinfoldResults({
        protocolId: state.skinfold.protocolId,
        sex: state.profile.sex,
        age: state.profile.age,
        weightKg: latestRecord.weight,
        folds: state.skinfold.folds
      }),
    [state.skinfold.protocolId, state.skinfold.folds, state.profile.sex, state.profile.age, latestRecord.weight]
  );

  const integratedComposition = useMemo(() => {
    const w = Number(latestRecord.weight) || 80;
    const bf =
      latestRecord.bodyFat !== null && latestRecord.bodyFat !== undefined
        ? Number(latestRecord.bodyFat)
        : skinfoldResults.bodyFatPct || 16.0;
    const fatMass = Number(((w * bf) / 100).toFixed(1));
    const leanMass = Number((w - fatMass).toFixed(1));
    return { weight: w, bodyFat: bf, fatMass, leanMass };
  }, [latestRecord, skinfoldResults.bodyFatPct]);

  const clinicalSim = useMemo(
    () => simulateMultiAgentPK(state.clinicalStudy.agents, state.clinicalStudy.horizonWeeks),
    [state.clinicalStudy.agents, state.clinicalStudy.horizonWeeks]
  );

  const filteredEncyclopediaDrugs = useMemo(() => {
    const cat = state.clinicalStudy.selectedCategory || 'all';
    const q = (state.clinicalStudy.searchQuery || '').trim().toLowerCase();
    return REGULATED_DRUGS.filter((d) => {
      const matchCat = cat === 'all' || d.category === cat;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.brandNames.toLowerCase().includes(q) ||
        d.drugClass.toLowerCase().includes(q)
      );
    });
  }, [state.clinicalStudy.selectedCategory, state.clinicalStudy.searchQuery]);

  const selectedEncyclopediaDrug = useMemo(() => {
    return (
      filteredEncyclopediaDrugs.find((d) => d.id === state.clinicalStudy.selectedEncyclopediaDrugId) ||
      filteredEncyclopediaDrugs[0] ||
      REGULATED_DRUGS[0]
    );
  }, [filteredEncyclopediaDrugs, state.clinicalStudy.selectedEncyclopediaDrugId]);

  const weeklyNutrition = useMemo(() => {
    const weight = Number(latestRecord.weight) || 80;
    const proteinG = Math.round(weight * (Number(state.nutrition.proteinGKg) || 2.1));
    const fatG = Math.round(weight * (Number(state.nutrition.fatGKg) || 0.75));

    const days = WEEK_DAYS.map((d) => {
      const typeKey = state.nutrition.dayTypes[d.id] || 'moderate';
      const cfg = DAY_TYPE_CONFIG[typeKey] || DAY_TYPE_CONFIG.moderate;
      const carbsG = Math.round(weight * cfg.carbsGKg);
      const kcal = proteinG * 4 + carbsG * 4 + fatG * 9;
      return {
        ...d,
        typeKey,
        typeLabel: cfg.label,
        color: cfg.color,
        badgeClass: cfg.bg,
        proteinG,
        carbsG,
        fatG,
        kcal
      };
    });

    const avgKcal = Math.round(days.reduce((acc, d) => acc + d.kcal, 0) / days.length);
    return { weight, proteinG, fatG, days, avgKcal };
  }, [latestRecord.weight, state.nutrition]);

  const activeNutritionDay = useMemo(
    () =>
      weeklyNutrition.days.find((d) => d.id === state.nutrition.selectedDayId) ||
      weeklyNutrition.days[0],
    [weeklyNutrition.days, state.nutrition.selectedDayId]
  );

  const mealPlanTotals = useMemo(() => {
    let grandKcal = 0;
    let grandP = 0;
    let grandC = 0;
    let grandF = 0;

    const enrichedMeals = state.mealPlan.map((meal) => {
      let mKcal = 0;
      let mP = 0;
      let mC = 0;
      let mF = 0;

      const items = meal.items.map((item) => {
        const food = FOOD_DATABASE.find((f) => f.id === item.foodId) || FOOD_DATABASE[0];
        const ratio = (Number(item.grams) || 0) / 100;
        const kcal = food.kcal * ratio;
        const p = food.protein * ratio;
        const c = food.carbs * ratio;
        const f = food.fat * ratio;

        mKcal += kcal;
        mP += p;
        mC += c;
        mF += f;

        return {
          ...item,
          food,
          kcal: Math.round(kcal),
          protein: Number(p.toFixed(1)),
          carbs: Number(c.toFixed(1)),
          fat: Number(f.toFixed(1))
        };
      });

      grandKcal += mKcal;
      grandP += mP;
      grandC += mC;
      grandF += mF;

      return {
        ...meal,
        items,
        totals: {
          kcal: Math.round(mKcal),
          protein: Math.round(mP),
          carbs: Math.round(mC),
          fat: Math.round(mF)
        }
      };
    });

    return {
      meals: enrichedMeals,
      grand: {
        kcal: Math.round(grandKcal),
        protein: Math.round(grandP),
        carbs: Math.round(grandC),
        fat: Math.round(grandF)
      }
    };
  }, [state.mealPlan]);

  const equivalenceCalc = useMemo(() => {
    const groupFoods = FOOD_DATABASE.filter((f) => f.group === state.equivalence.group);
    const baseFood = groupFoods.find((f) => f.id === state.equivalence.baseFoodId) || groupFoods[0];
    const targetFood = groupFoods.find((f) => f.id === state.equivalence.targetFoodId) || groupFoods[1] || groupFoods[0];
    const baseGrams = Math.max(0, Number(state.equivalence.baseGrams) || 0);
    const isKcalMode = state.equivalence.mode === 'kcal';
    const criterionKey = isKcalMode ? 'kcal' : state.equivalence.group;

    const baseCriterionAmount = (baseFood[criterionKey] * baseGrams) / 100;
    const targetCriterionPer100 = Math.max(0.1, targetFood[criterionKey]);
    const equivalentGrams = Math.round((baseCriterionAmount / targetCriterionPer100) * 100);

    const calcMacros = (food, g) => ({
      kcal: Math.round((food.kcal * g) / 100),
      protein: Number(((food.protein * g) / 100).toFixed(1)),
      carbs: Number(((food.carbs * g) / 100).toFixed(1)),
      fat: Number(((food.fat * g) / 100).toFixed(1))
    });

    return {
      groupFoods,
      baseFood,
      targetFood,
      baseGrams,
      equivalentGrams,
      baseMacros: calcMacros(baseFood, baseGrams),
      targetMacros: calcMacros(targetFood, equivalentGrams)
    };
  }, [state.equivalence]);

  const handleSwitchPreset = (presetKey) => {
    const fresh = buildStateFromPreset(presetKey);
    setState(fresh);
    showToast(`Perfil "${PRESET_PROFILES[presetKey].label}" carregado.`);
  };

  const handleSaveSkinfoldToHistory = () => {
    if (!skinfoldResults.isValid) {
      showToast('Preencha todas as pregas cutâneas do protocolo antes de salvar.', 'error');
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const nextWeek = (Number(latestRecord.week) || state.records.length) + 1;
    const protoLabel =
      state.skinfold.protocolId === 'jp7_all' ? 'Adipômetro JP7' : 'Adipômetro JP3';

    const entry = {
      id: `sf_${Date.now()}`,
      date: today,
      week: nextWeek,
      weight: latestRecord.weight,
      bodyFat: skinfoldResults.bodyFatPct,
      rhr: latestRecord.rhr || null,
      chest: latestRecord.chest || null,
      waist: latestRecord.waist || null,
      abdomen: latestRecord.abdomen || null,
      hip: latestRecord.hip || null,
      armR: latestRecord.armR || null,
      armL: latestRecord.armL || null,
      thighR: latestRecord.thighR || null,
      thighL: latestRecord.thighL || null,
      source: protoLabel,
      note: `${protoLabel}: Σ=${skinfoldResults.sum}mm | Dc=${skinfoldResults.density} | MM=${skinfoldResults.leanMassKg}kg`
    };

    setState((prev) => ({
      ...prev,
      records: [...prev.records, entry]
    }));
    showToast(
      `Avaliação salva (${skinfoldResults.bodyFatPct}% gordura) e sincronizada com a Visão Integrada!`
    );
  };

  const handleAddDrugToSimulator = (drug) => {
    if (state.clinicalStudy.agents.length >= 3) {
      showToast('Limite de 3 agentes simultâneos no simulador.', 'error');
      return;
    }
    setState((prev) => ({
      ...prev,
      clinicalStudy: {
        ...prev.clinicalStudy,
        agents: [
          ...prev.clinicalStudy.agents,
          {
            id: `ag_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
            drugId: drug.id,
            dose: drug.defaultDose,
            freqDays: drug.defaultFreqDays,
            startWeek: 1
          }
        ]
      }
    }));
    setActiveModule('clinical');
    setActiveSubTab('simulator');
    showToast(`${drug.name} (${drug.brandNames}) enviado para o Simulador Farmacocinético.`);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-protocol-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON exportado.');
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (parsed && parsed.profile && parsed.clinicalStudy && parsed.nutrition && parsed.records) {
          setState(parsed);
          showToast('Backup JSON importado com sucesso!');
        } else {
          showToast('Arquivo JSON inválido.', 'error');
        }
      } catch {
        showToast('Erro ao ler arquivo JSON.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleAddCircumferenceRecord = (e) => {
    e.preventDefault();
    if (!newRecord.date || !newRecord.weight) {
      showToast('Informe a data e o peso corporal (kg).', 'error');
      return;
    }
    const toOpt = (v) =>
      v !== '' && !Number.isNaN(parseFloat(v)) ? Number(parseFloat(v).toFixed(1)) : null;

    const nextWeek =
      newRecord.week !== ''
        ? Math.max(1, Math.round(Number(newRecord.week)))
        : (Number(latestRecord.week) || state.records.length) + 1;

    const entry = {
      id: `rec_${Date.now()}`,
      date: newRecord.date,
      week: nextWeek,
      weight: Number(parseFloat(newRecord.weight).toFixed(1)),
      bodyFat: toOpt(newRecord.bodyFat) ?? latestRecord.bodyFat ?? null,
      rhr: newRecord.rhr !== '' ? Math.round(Number(newRecord.rhr)) : null,
      chest: toOpt(newRecord.chest),
      waist: toOpt(newRecord.waist),
      abdomen: toOpt(newRecord.abdomen),
      hip: toOpt(newRecord.hip),
      armR: toOpt(newRecord.armR),
      armL: toOpt(newRecord.armL),
      thighR: toOpt(newRecord.thighR),
      thighL: toOpt(newRecord.thighL),
      source: 'Manual / Fita',
      note: newRecord.note.trim() || `Avaliação Sem ${nextWeek}`
    };

    setState((prev) => ({
      ...prev,
      records: [...prev.records, entry].sort((a, b) => a.date.localeCompare(b.date))
    }));

    setNewRecord({
      date: new Date().toISOString().slice(0, 10),
      week: '',
      weight: '',
      bodyFat: '',
      rhr: '',
      chest: '',
      waist: '',
      abdomen: '',
      hip: '',
      armR: '',
      armL: '',
      thighR: '',
      thighL: '',
      note: ''
    });
    showToast('Avaliação antropométrica salva!');
  };

  const MEASURE_OPTIONS = [
    { key: 'weight', label: 'Peso Corporal', unit: 'kg', color: '#00e5ff' },
    { key: 'bodyFat', label: '% Gordura', unit: '%', color: '#14b8a6' },
    { key: 'rhr', label: 'FCR (Repouso)', unit: 'bpm', color: '#f472b6' },
    { key: 'abdomen', label: 'Abdômen', unit: 'cm', color: '#38bdf8' },
    { key: 'waist', label: 'Cintura', unit: 'cm', color: '#06b6d4' },
    { key: 'chest', label: 'Tórax', unit: 'cm', color: '#a78bfa' },
    { key: 'hip', label: 'Quadril', unit: 'cm', color: '#fbbf24' },
    { key: 'armR', label: 'Braço D', unit: 'cm', color: '#34d399' },
    { key: 'thighR', label: 'Coxa D', unit: 'cm', color: '#60a5fa' }
  ];

  const currentMeasureMeta =
    MEASURE_OPTIONS.find((m) => m.key === selectedMeasureMetric) || MEASURE_OPTIONS[0];

  const activeProtocolObj =
    SKINFOLD_PROTOCOLS[state.skinfold.protocolId] || SKINFOLD_PROTOCOLS.jp3_male;

  const selectedSiteObj =
    SKINFOLD_SITES[state.skinfold.selectedSiteId] || SKINFOLD_SITES[activeProtocolObj.sites[0]];

  return (
    <div
      className="min-h-screen text-slate-100 selection:bg-[#00e5ff] selection:text-slate-950"
      style={{
        background: 'linear-gradient(145deg, #060d1f 0%, #08132b 52%, #0b1938 100%)'
      }}
    >
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-[#00e5ff]/40 bg-[#08132b]/95 px-4 py-3 text-xs font-medium text-white shadow-2xl backdrop-blur-xl">
          {toast.type === 'error' ? (
            <AlertCircle className="h-4 w-4 text-rose-400" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-[#00e5ff]" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {/* ================================================================= */}
        {/* HEADER SUPERIOR COM SELETOR DE PERFIL & BACKUP JSON               */}
        {/* ================================================================= */}
        <header className="mb-5 rounded-3xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3.5">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg shadow-cyan-500/25"
                style={{ background: 'linear-gradient(135deg, #00e5ff 0%, #14b8a6 100%)' }}
              >
                <Sparkles className="h-6 w-6 text-slate-950" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                    {state.profile.appTitle}
                  </h1>
                  <span className="rounded-full border border-[#00e5ff]/30 bg-[#00e5ff]/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-200">
                    {state.profile.goalLabel}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  Caso Ativo: <strong className="text-slate-200">{state.profile.userName}</strong> •{' '}
                  {state.profile.sex === 'female' ? 'Feminino' : 'Masculino'}, {state.profile.age}{' '}
                  anos
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-xl border border-[#00e5ff]/30 bg-slate-950/80 px-3 py-1.5">
                <UserCheck className="h-3.5 w-3.5 text-[#00e5ff]" />
                <select
                  value={state.activePresetId || 'caso_padrao'}
                  onChange={(e) => handleSwitchPreset(e.target.value)}
                  className="bg-transparent text-xs font-bold text-cyan-200 outline-none"
                  aria-label="Selecionar Perfil"
                >
                  {Object.values(PRESET_PROFILES).map((pr) => (
                    <option key={pr.id} value={pr.id} className="bg-[#08132b] text-white">
                      {pr.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleExportJSON}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#00e5ff]/25 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Exportar JSON</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-teal-400/25 bg-teal-500/10 px-3 py-2 text-xs font-semibold text-teal-200 transition hover:bg-teal-500/20"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Importar</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportJSON}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => handleSwitchPreset(state.activePresetId || 'caso_padrao')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20"
                title="Resetar perfil atual"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Resetar</span>
              </button>
            </div>
          </div>
        </header>

        {/* ================================================================= */}
        {/* NAVEGAÇÃO HIERÁRQUICA EM 2 NÍVEIS                                 */}
        {/* ================================================================= */}
        <div className="mb-6 space-y-2.5">
          {/* NÍVEL 1: 4 Módulos Principais */}
          <nav
            aria-label="Módulos Principais"
            className="grid grid-cols-2 gap-2 rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/90 p-2 backdrop-blur-xl sm:grid-cols-4"
          >
            {NAVIGATION_MODULES.map((mod) => {
              const Icon = mod.icon;
              const isActive = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => handleSelectModule(mod.id)}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-extrabold transition sm:text-sm ${
                    isActive
                      ? 'text-slate-950 shadow-lg shadow-cyan-500/25'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                  style={
                    isActive
                      ? { background: 'linear-gradient(135deg, #00e5ff 0%, #14b8a6 100%)' }
                      : undefined
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{mod.label}</span>
                </button>
              );
            })}
          </nav>

          {/* NÍVEL 2: Sub-abas em linha reta com scroll lateral suave */}
          {currentModuleObj.subTabs.length > 1 && (
            <div className="flex flex-nowrap items-center gap-2 overflow-x-auto rounded-xl border border-[#00e5ff]/15 bg-slate-950/75 px-3 py-2 [scrollbar-width:thin] [scrollbar-color:rgba(0,229,255,0.4)_transparent]">
              <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {currentModuleObj.label}:
              </span>
              {currentModuleObj.subTabs.map((sub) => {
                const subActive = activeSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setActiveSubTab(sub.id)}
                    className={`shrink-0 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                      subActive
                        ? 'border border-[#00e5ff]/50 bg-[#00e5ff]/20 text-cyan-200 shadow-sm'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* MÓDULO 1: VISÃO INTEGRADA                                         */}
        {/* ================================================================= */}
        {activeModule === 'integrated' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Peso Atual vs. Inicial</span>
                  <Scale className="h-4 w-4 text-[#00e5ff]" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white">
                    {integratedComposition.weight.toFixed(1)} kg
                  </span>
                  <span className="text-xs font-bold text-[#00e5ff]">
                    ({(integratedComposition.weight - firstRecord.weight).toFixed(1)} kg)
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Meta: <strong className="text-slate-200">{state.profile.targetWeight} kg</strong> •
                  FCR: <strong className="text-teal-300">{latestRecord.rhr || '—'} bpm</strong>
                </p>
              </div>

              <div className="rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>% Gordura Real (Adipômetro)</span>
                  <HeartPulse className="h-4 w-4 text-[#14b8a6]" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-teal-300">
                    {integratedComposition.bodyFat.toFixed(1)}%
                  </span>
                  <span className="text-xs text-slate-400">
                    ({integratedComposition.fatMass} kg gorda)
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Massa Magra: <strong className="text-cyan-200">{integratedComposition.leanMass} kg</strong>
                </p>
              </div>

              <div className="rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Meta Calórica ({activeNutritionDay.short})</span>
                  <Flame className="h-4 w-4 text-[#00e5ff]" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white">
                    {activeNutritionDay.kcal} kcal
                  </span>
                  <span className="text-xs font-semibold text-teal-300">
                    {activeNutritionDay.typeLabel}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Média Semanal: <strong className="text-slate-200">{weeklyNutrition.avgKcal} kcal/d</strong>
                </p>
              </div>

              <div className="rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Agentes no Simulador Clínico</span>
                  <Stethoscope className="h-4 w-4 text-[#00e5ff]" />
                </div>
                <div className="mt-2 truncate text-sm font-extrabold text-cyan-200">
                  {clinicalSim.series.length
                    ? clinicalSim.series.map((s) => `${s.drug.name} (${s.dose}${s.drug.unit})`).join(' + ')
                    : 'Nenhum agente ativo'}
                </div>
                <p className="mt-1.5 text-xs text-slate-400">
                  Horizonte: <strong className="text-slate-200">{clinicalSim.safeWeeks} semanas</strong>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 backdrop-blur-xl">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white">
                    Gráfico Multi-Camadas: Peso Corporal × % Gordura (Adipômetro) × Exposição Farmacológica
                  </h2>
                  <p className="text-xs text-slate-400">
                    Correlação longitudinal integrando medidas antropométricas reais com a cinética do protocolo ativo.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-[#00e5ff]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#00e5ff]" /> Peso (kg)
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-[#14b8a6]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#14b8a6]" /> % Gordura (Adipômetro)
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-violet-300">
                    <span className="w-4 border-t-2 border-dashed border-violet-400" /> Exposição PK (%)
                  </span>
                </div>
              </div>

              <IntegratedOverviewChartSVG records={state.records} clinicalSim={clinicalSim} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-3 rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 backdrop-blur-xl lg:col-span-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">
                    Linha do Tempo Integrada (Marcos Antropométricos, Dieta & Titulação)
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModule('measures');
                      setActiveSubTab('skinfold');
                    }}
                    className="rounded-lg border border-teal-400/30 bg-teal-500/10 px-2.5 py-1 text-xs font-bold text-teal-200 hover:bg-teal-500/20"
                  >
                    + Nova Dobra
                  </button>
                </div>

                <div className="space-y-2.5">
                  {state.records.map((rec, idx) => (
                    <div
                      key={rec.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/65 px-3.5 py-2.5 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="rounded-lg bg-[#00e5ff]/15 px-2.5 py-1 font-extrabold text-[#00e5ff]">
                          Sem {rec.week || idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-white">{rec.note}</span>
                          <span className="block text-[11px] text-slate-400">
                            {rec.date} • Fonte: {rec.source || 'Avaliação'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <span className="block font-extrabold text-[#00e5ff]">{rec.weight} kg</span>
                          <span className="text-[11px] text-teal-300">
                            {rec.bodyFat ? `${rec.bodyFat}% Gordura` : '—'}
                          </span>
                        </div>
                        <div className="hidden text-[11px] text-slate-400 sm:block">
                          Cintura: {rec.waist || '—'}cm
                          <br />
                          FCR: {rec.rhr || '—'}bpm
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 backdrop-blur-xl">
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white">Acesso Rápido aos Módulos</h3>
                  <p className="text-xs text-slate-400">
                    Navegue diretamente para atualizar dobras cutâneas, ajustar refeições ou estudar a farmacologia clínica.
                  </p>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModule('measures');
                        setActiveSubTab('skinfold');
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-left text-xs font-bold text-white transition hover:border-[#00e5ff]/40"
                    >
                      <span>Calcular Pregas no Adipômetro</span>
                      <ChevronRight className="h-4 w-4 text-[#00e5ff]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveModule('clinical');
                        setActiveSubTab('encyclopedia');
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-left text-xs font-bold text-white transition hover:border-[#00e5ff]/40"
                    >
                      <span>Consultar Bulário & Enciclopédia</span>
                      <ChevronRight className="h-4 w-4 text-teal-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveModule('nutrition');
                        setActiveSubTab('mealplan');
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-left text-xs font-bold text-white transition hover:border-[#00e5ff]/40"
                    >
                      <span>Ajustar Cardápio & Macros do Dia</span>
                      <ChevronRight className="h-4 w-4 text-[#00e5ff]" />
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-[#00e5ff]/25 bg-cyan-500/10 p-3 text-xs text-cyan-100">
                  <strong>Aderência do Cardápio ({activeNutritionDay.short}):</strong>{' '}
                  {mealPlanTotals.grand.kcal} kcal planejadas de {activeNutritionDay.kcal} kcal meta (
                  {Math.round((mealPlanTotals.grand.kcal / Math.max(1, activeNutritionDay.kcal)) * 100)}%).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MÓDULO 2: NUTRIÇÃO & DIETA                                        */}
        {/* ================================================================= */}
        {activeModule === 'nutrition' && (
          <>
            {activeSubTab === 'cycle' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 backdrop-blur-xl">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-base font-bold text-white">
                        Ciclo Semanal de Carboidratos & Dias de Refeed
                      </h2>
                      <p className="text-xs text-slate-400">
                        Peso base sincronizado: <strong className="text-[#00e5ff]">{weeklyNutrition.weight} kg</strong> • Média semanal:{' '}
                        <strong className="text-teal-300">{weeklyNutrition.avgKcal} kcal/dia</strong>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/75 px-3 py-1.5">
                        <span className="text-xs text-slate-400">Proteína (g/kg):</span>
                        <input
                          type="number"
                          step="0.1"
                          min="1.0"
                          max="3.5"
                          value={state.nutrition.proteinGKg}
                          onChange={(e) =>
                            setState((prev) => ({
                              ...prev,
                              nutrition: { ...prev.nutrition, proteinGKg: Number(e.target.value) || 2.0 }
                            }))
                          }
                          className="w-14 bg-transparent text-right text-xs font-bold text-[#00e5ff] outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/75 px-3 py-1.5">
                        <span className="text-xs text-slate-400">Gordura (g/kg):</span>
                        <input
                          type="number"
                          step="0.05"
                          min="0.4"
                          max="1.5"
                          value={state.nutrition.fatGKg}
                          onChange={(e) =>
                            setState((prev) => ({
                              ...prev,
                              nutrition: { ...prev.nutrition, fatGKg: Number(e.target.value) || 0.75 }
                            }))
                          }
                          className="w-14 bg-transparent text-right text-xs font-bold text-teal-300 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
                    {weeklyNutrition.days.map((day) => {
                      const isSelected = state.nutrition.selectedDayId === day.id;
                      return (
                        <div
                          key={day.id}
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              nutrition: { ...prev.nutrition, selectedDayId: day.id }
                            }))
                          }
                          className={`cursor-pointer rounded-2xl border p-3.5 transition ${
                            isSelected
                              ? 'border-[#00e5ff] bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                              : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-white">{day.short}</span>
                            {isSelected && (
                              <span className="rounded bg-[#00e5ff] px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
                                Ativo
                              </span>
                            )}
                          </div>

                          <select
                            value={day.typeKey}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setState((prev) => ({
                                ...prev,
                                nutrition: {
                                  ...prev.nutrition,
                                  dayTypes: { ...prev.nutrition.dayTypes, [day.id]: e.target.value }
                                }
                              }))
                            }
                            className={`mt-2 w-full rounded-lg border px-2 py-1 text-[11px] font-semibold outline-none ${day.badgeClass}`}
                          >
                            {Object.entries(DAY_TYPE_CONFIG).map(([k, cfg]) => (
                              <option key={k} value={k} className="bg-[#08132b] text-white">
                                {cfg.label}
                              </option>
                            ))}
                          </select>

                          <div className="mt-3 text-lg font-extrabold text-white">{day.kcal} kcal</div>
                          <div className="mt-1.5 space-y-0.5 text-[11px] text-slate-300">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Proteína:</span>
                              <span className="font-semibold text-teal-300">{day.proteinG}g</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Carbo:</span>
                              <span className="font-semibold text-[#00e5ff]">{day.carbsG}g</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Gordura:</span>
                              <span className="font-semibold text-amber-300">{day.fatG}g</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 backdrop-blur-xl">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Distribuição Calórica Semanal por Macronutriente
                      </h3>
                      <p className="text-xs text-slate-400">
                        Clique em qualquer dia acima para sincronizar com o Cardápio Personalizado.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1.5 text-teal-300">
                        <span className="h-2.5 w-2.5 rounded-full bg-teal-400" /> Proteína
                      </span>
                      <span className="flex items-center gap-1.5 text-[#00e5ff]">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#00e5ff]" /> Carboidratos
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-300">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Gorduras
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 items-end gap-3 pt-4" style={{ height: 220 }}>
                    {(() => {
                      const maxKcal = Math.max(...weeklyNutrition.days.map((d) => d.kcal), 2500);
                      return weeklyNutrition.days.map((day) => {
                        const pKcal = day.proteinG * 4;
                        const cKcal = day.carbsG * 4;
                        const fKcal = day.fatG * 9;
                        const totalH = Math.max(24, (day.kcal / maxKcal) * 165);
                        const pPct = (pKcal / day.kcal) * 100;
                        const cPct = (cKcal / day.kcal) * 100;
                        const fPct = (fKcal / day.kcal) * 100;

                        return (
                          <div key={day.id} className="flex flex-col items-center gap-2">
                            <span className="text-[11px] font-bold text-white">{day.kcal}</span>
                            <div
                              className="flex w-full max-w-[46px] flex-col-reverse overflow-hidden rounded-xl border border-white/10 shadow-md"
                              style={{ height: totalH }}
                            >
                              <div style={{ height: `${pPct}%` }} className="bg-teal-400" />
                              <div style={{ height: `${cPct}%` }} className="bg-[#00e5ff]" />
                              <div style={{ height: `${fPct}%` }} className="bg-amber-400" />
                            </div>
                            <span className="text-xs font-semibold text-slate-300">{day.short}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'mealplan' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 backdrop-blur-xl">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-[#00e5ff]" />
                        <h2 className="text-base font-bold text-white">
                          Cardápio Personalizado vs. Meta ({activeNutritionDay.label} — {activeNutritionDay.typeLabel})
                        </h2>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Configure horários, refeições e gramaturas com cálculo automático em tempo real.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={state.nutrition.selectedDayId}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            nutrition: { ...prev.nutrition, selectedDayId: e.target.value }
                          }))
                        }
                        className="rounded-xl border border-[#00e5ff]/30 bg-slate-950/80 px-3 py-2 text-xs font-semibold text-cyan-100 outline-none"
                      >
                        {weeklyNutrition.days.map((d) => (
                          <option key={d.id} value={d.id}>
                            Meta: {d.label} ({d.kcal} kcal)
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          setState((prev) => ({
                            ...prev,
                            mealPlan: [
                              ...prev.mealPlan,
                              {
                                id: `meal_${Date.now()}`,
                                name: `Refeição ${prev.mealPlan.length + 1}`,
                                time: '15:30',
                                items: [{ id: `it_${Date.now()}`, foodId: 'frango', grams: 150 }]
                              }
                            ]
                          }));
                          showToast('Nova refeição adicionada.');
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-slate-950"
                        style={{ background: 'linear-gradient(135deg, #00e5ff 0%, #14b8a6 100%)' }}
                      >
                        <Plus className="h-4 w-4" />
                        Adicionar Refeição
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { label: 'Calorias Totais', cur: mealPlanTotals.grand.kcal, target: activeNutritionDay.kcal, unit: 'kcal' },
                      { label: 'Proteínas', cur: mealPlanTotals.grand.protein, target: activeNutritionDay.proteinG, unit: 'g' },
                      { label: 'Carboidratos', cur: mealPlanTotals.grand.carbs, target: activeNutritionDay.carbsG, unit: 'g' },
                      { label: 'Gorduras', cur: mealPlanTotals.grand.fat, target: activeNutritionDay.fatG, unit: 'g' }
                    ].map((bar) => {
                      const pct = Math.min(100, Math.round((bar.cur / Math.max(1, bar.target)) * 100));
                      const over = bar.cur > bar.target * 1.08;
                      return (
                        <div key={bar.label} className="rounded-xl border border-slate-800 bg-slate-950/65 p-3.5">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>{bar.label}</span>
                            <span className={`font-bold ${over ? 'text-amber-300' : 'text-[#00e5ff]'}`}>{pct}%</span>
                          </div>
                          <div className="mt-1 text-base font-extrabold text-white">
                            {bar.cur}{' '}
                            <span className="text-xs font-normal text-slate-400">
                              / {bar.target} {bar.unit}
                            </span>
                          </div>
                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${pct}%`,
                                background: over
                                  ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                  : 'linear-gradient(135deg, #00e5ff 0%, #14b8a6 100%)'
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {mealPlanTotals.meals.map((meal) => (
                    <div
                      key={meal.id}
                      className="flex flex-col justify-between rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 backdrop-blur-xl"
                    >
                      <div>
                        <div className="mb-3 flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
                          <div className="flex flex-1 items-center gap-2">
                            <input
                              type="time"
                              value={meal.time}
                              onChange={(e) =>
                                setState((prev) => ({
                                  ...prev,
                                  mealPlan: prev.mealPlan.map((m) =>
                                    m.id === meal.id ? { ...m, time: e.target.value } : m
                                  )
                                }))
                              }
                              className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs font-bold text-[#00e5ff] outline-none focus:border-[#00e5ff]"
                            />
                            <input
                              type="text"
                              value={meal.name}
                              onChange={(e) =>
                                setState((prev) => ({
                                  ...prev,
                                  mealPlan: prev.mealPlan.map((m) =>
                                    m.id === meal.id ? { ...m, name: e.target.value } : m
                                  )
                                }))
                              }
                              className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-bold text-white outline-none hover:border-slate-700 focus:border-[#00e5ff] focus:bg-slate-950/70"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setState((prev) => ({
                                ...prev,
                                mealPlan: prev.mealPlan.filter((m) => m.id !== meal.id)
                              }))
                            }
                            className="rounded-lg p-1.5 text-rose-300 hover:bg-rose-500/15"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {meal.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800/90 bg-slate-950/60 p-2.5"
                            >
                              <select
                                value={item.foodId}
                                onChange={(e) =>
                                  setState((prev) => ({
                                    ...prev,
                                    mealPlan: prev.mealPlan.map((m) =>
                                      m.id === meal.id
                                        ? {
                                            ...m,
                                            items: m.items.map((it) =>
                                              it.id === item.id ? { ...it, foodId: e.target.value } : it
                                            )
                                          }
                                        : m
                                    )
                                  }))
                                }
                                className="min-w-[165px] flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#00e5ff]"
                              >
                                {FOOD_DATABASE.map((f) => (
                                  <option key={f.id} value={f.id}>
                                    {f.name}
                                  </option>
                                ))}
                              </select>

                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min="0"
                                  step="5"
                                  value={item.grams}
                                  onChange={(e) =>
                                    setState((prev) => ({
                                      ...prev,
                                      mealPlan: prev.mealPlan.map((m) =>
                                        m.id === meal.id
                                          ? {
                                              ...m,
                                              items: m.items.map((it) =>
                                                it.id === item.id
                                                  ? { ...it, grams: Math.max(0, Number(e.target.value) || 0) }
                                                  : it
                                              )
                                            }
                                          : m
                                      )
                                    }))
                                  }
                                  className="w-20 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-right text-xs font-bold text-white outline-none focus:border-[#00e5ff]"
                                />
                                <span className="text-xs text-slate-400">g</span>
                              </div>

                              <div className="w-full text-[11px] text-slate-400 sm:ml-auto sm:w-auto">
                                {item.kcal} kcal • P:{item.protein}g • C:{item.carbs}g • G:{item.fat}g
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  setState((prev) => ({
                                    ...prev,
                                    mealPlan: prev.mealPlan.map((m) =>
                                      m.id === meal.id
                                        ? { ...m, items: m.items.filter((it) => it.id !== item.id) }
                                        : m
                                    )
                                  }))
                                }
                                className="rounded-lg p-1 text-slate-400 hover:bg-rose-500/15 hover:text-rose-300"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-3">
                        <button
                          type="button"
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              mealPlan: prev.mealPlan.map((m) =>
                                m.id === meal.id
                                  ? {
                                      ...m,
                                      items: [
                                        ...m.items,
                                        {
                                          id: `it_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
                                          foodId: 'arroz_branco',
                                          grams: 100
                                        }
                                      ]
                                    }
                                  : m
                              )
                            }))
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#00e5ff]/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/20"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Adicionar Alimento
                        </button>

                        <div className="text-xs font-bold text-[#00e5ff]">
                          Subtotal: {meal.totals.kcal} kcal • P:{meal.totals.protein}g • C:{meal.totals.carbs}g • G:{meal.totals.fat}g
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTab === 'equivalence' && (
              <div className="rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-white">
                      Calculadora Inteligente de Equivalência Alimentar
                    </h2>
                    <p className="text-xs text-slate-400">
                      Substitua alimentos mantendo equivalência exata do macronutriente dominante ou isocaloria.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex rounded-xl border border-slate-700 bg-slate-950 p-1">
                      <button
                        type="button"
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            equivalence: { ...prev.equivalence, mode: 'macro' }
                          }))
                        }
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                          state.equivalence.mode === 'macro' ? 'bg-[#00e5ff] text-slate-950' : 'text-slate-300'
                        }`}
                      >
                        Por Macro
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            equivalence: { ...prev.equivalence, mode: 'kcal' }
                          }))
                        }
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                          state.equivalence.mode === 'kcal' ? 'bg-[#00e5ff] text-slate-950' : 'text-slate-300'
                        }`}
                      >
                        Isocalórico
                      </button>
                    </div>

                    <div className="flex gap-1.5">
                      {[
                        { key: 'carbs', label: 'Carboidratos' },
                        { key: 'protein', label: 'Proteínas' },
                        { key: 'fat', label: 'Gorduras' }
                      ].map((g) => (
                        <button
                          key={g.key}
                          type="button"
                          onClick={() => {
                            const foods = FOOD_DATABASE.filter((f) => f.group === g.key);
                            setState((prev) => ({
                              ...prev,
                              equivalence: {
                                ...prev.equivalence,
                                group: g.key,
                                baseFoodId: foods[0]?.id || '',
                                baseGrams: g.key === 'fat' ? 15 : 150,
                                targetFoodId: foods[1]?.id || foods[0]?.id || ''
                              }
                            }));
                          }}
                          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                            state.equivalence.group === g.key
                              ? 'bg-[#14b8a6] text-slate-950'
                              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 items-center gap-4 lg:grid-cols-11">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/65 p-4 lg:col-span-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#00e5ff]">
                      1. Alimento Original
                    </span>
                    <select
                      value={equivalenceCalc.baseFood.id}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          equivalence: { ...prev.equivalence, baseFoodId: e.target.value }
                        }))
                      }
                      className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-[#00e5ff]"
                    >
                      {equivalenceCalc.groupFoods.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>

                    <div className="mt-3 flex items-center gap-2">
                      <label className="text-xs text-slate-400">Quantidade (g):</label>
                      <input
                        type="number"
                        min="0"
                        step="5"
                        value={state.equivalence.baseGrams}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            equivalence: {
                              ...prev.equivalence,
                              baseGrams: Math.max(0, Number(e.target.value) || 0)
                            }
                          }))
                        }
                        className="w-28 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-right text-sm font-bold text-white outline-none focus:border-[#00e5ff]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center lg:col-span-1">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#00e5ff]/30 bg-cyan-500/15 text-[#00e5ff]">
                      <ArrowRightLeft className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#00e5ff]/30 bg-cyan-500/5 p-4 lg:col-span-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300">
                      2. Alimento Substituto
                    </span>
                    <select
                      value={equivalenceCalc.targetFood.id}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          equivalence: { ...prev.equivalence, targetFoodId: e.target.value }
                        }))
                      }
                      className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-[#00e5ff]"
                    >
                      {equivalenceCalc.groupFoods.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>

                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="text-xs text-slate-300">Porção equivalente:</span>
                      <span className="text-2xl font-extrabold text-[#00e5ff]">
                        {equivalenceCalc.equivalentGrams} g
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2">Alimento</th>
                        <th className="py-2">Porção</th>
                        <th className="py-2">Calorias</th>
                        <th className="py-2">Proteínas</th>
                        <th className="py-2">Carboidratos</th>
                        <th className="py-2">Gorduras</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      <tr>
                        <td className="py-2.5 font-semibold text-white">{equivalenceCalc.baseFood.name}</td>
                        <td className="py-2.5 font-bold text-[#00e5ff]">{equivalenceCalc.baseGrams} g</td>
                        <td className="py-2.5 text-slate-200">{equivalenceCalc.baseMacros.kcal} kcal</td>
                        <td className="py-2.5 text-slate-200">{equivalenceCalc.baseMacros.protein} g</td>
                        <td className="py-2.5 text-slate-200">{equivalenceCalc.baseMacros.carbs} g</td>
                        <td className="py-2.5 text-slate-200">{equivalenceCalc.baseMacros.fat} g</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold text-teal-200">{equivalenceCalc.targetFood.name}</td>
                        <td className="py-2.5 font-extrabold text-teal-300">{equivalenceCalc.equivalentGrams} g</td>
                        <td className="py-2.5 text-slate-200">{equivalenceCalc.targetMacros.kcal} kcal</td>
                        <td className="py-2.5 text-slate-200">{equivalenceCalc.targetMacros.protein} g</td>
                        <td className="py-2.5 text-slate-200">{equivalenceCalc.targetMacros.carbs} g</td>
                        <td className="py-2.5 text-slate-200">{equivalenceCalc.targetMacros.fat} g</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ================================================================= */}
        {/* MÓDULO 3: MEDIDAS & ADIPÔMETRO                                    */}
        {/* ================================================================= */}
        {activeModule === 'measures' && (
          <>
            {activeSubTab === 'circumferences' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <form
                    onSubmit={handleAddCircumferenceRecord}
                    className="space-y-3 rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#00e5ff]" />
                      <h2 className="text-base font-bold text-white">Novo Registro Antropométrico</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="mb-1 block text-xs text-slate-300">Data*</label>
                        <input
                          type="date"
                          value={newRecord.date}
                          onChange={(e) => setNewRecord((p) => ({ ...p, date: e.target.value }))}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950/75 px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#00e5ff]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-300">Semana</label>
                        <input
                          type="number"
                          min="1"
                          placeholder={`${(Number(latestRecord.week) || state.records.length) + 1}`}
                          value={newRecord.week}
                          onChange={(e) => setNewRecord((p) => ({ ...p, week: e.target.value }))}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950/75 px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#00e5ff]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="mb-1 block text-[11px] text-slate-300">Peso (kg)*</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="79.2"
                          value={newRecord.weight}
                          onChange={(e) => setNewRecord((p) => ({ ...p, weight: e.target.value }))}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950/75 px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#00e5ff]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] text-slate-300">% Gordura</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="14.6"
                          value={newRecord.bodyFat}
                          onChange={(e) => setNewRecord((p) => ({ ...p, bodyFat: e.target.value }))}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950/75 px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#00e5ff]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] text-slate-300">FCR (bpm)</label>
                        <input
                          type="number"
                          placeholder="59"
                          value={newRecord.rhr}
                          onChange={(e) => setNewRecord((p) => ({ ...p, rhr: e.target.value }))}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950/75 px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#00e5ff]"
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-800 pt-2">
                      <span className="mb-2 block text-xs font-semibold text-[#00e5ff]">
                        Circunferências Corporais (cm)
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: 'chest', label: 'Tórax', ph: '103.2' },
                          { key: 'waist', label: 'Cintura', ph: '81.8' },
                          { key: 'abdomen', label: 'Abdômen', ph: '83.6' },
                          { key: 'hip', label: 'Quadril', ph: '96.4' },
                          { key: 'armR', label: 'Braço D', ph: '37.5' },
                          { key: 'armL', label: 'Braço E', ph: '37.3' },
                          { key: 'thighR', label: 'Coxa D', ph: '57.6' },
                          { key: 'thighL', label: 'Coxa E', ph: '57.5' }
                        ].map((f) => (
                          <div key={f.key}>
                            <label className="mb-0.5 block text-[11px] text-slate-400">{f.label}</label>
                            <input
                              type="number"
                              step="0.1"
                              placeholder={f.ph}
                              value={newRecord[f.key]}
                              onChange={(e) => setNewRecord((p) => ({ ...p, [f.key]: e.target.value }))}
                              className="w-full rounded-xl border border-slate-700 bg-slate-950/75 px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#00e5ff]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-slate-300">Observação</label>
                      <input
                        type="text"
                        placeholder="Ex.: jejum matinal"
                        value={newRecord.note}
                        onChange={(e) => setNewRecord((p) => ({ ...p, note: e.target.value }))}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950/75 px-3 py-1.5 text-xs text-white outline-none focus:border-[#00e5ff]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-950"
                      style={{ background: 'linear-gradient(135deg, #00e5ff 0%, #14b8a6 100%)' }}
                    >
                      <Plus className="h-4 w-4" />
                      Salvar Avaliação
                    </button>
                  </form>

                  <div className="space-y-5 lg:col-span-2">
                    <div className="rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 backdrop-blur-xl">
                      <div className="mb-3">
                        <h2 className="text-base font-bold text-white">
                          Evolução: {currentMeasureMeta.label} ({currentMeasureMeta.unit})
                        </h2>
                        <p className="text-xs text-slate-400">
                          Alterne entre peso, % gordura, FCR e circunferências regionais.
                        </p>
                      </div>

                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {MEASURE_OPTIONS.map((opt) => (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => setSelectedMeasureMetric(opt.key)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                              selectedMeasureMetric === opt.key
                                ? 'bg-[#00e5ff] text-slate-950'
                                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      <MetricTrendSVG
                        records={state.records}
                        metricKey={currentMeasureMeta.key}
                        label={currentMeasureMeta.label}
                        unit={currentMeasureMeta.unit}
                        color={currentMeasureMeta.color}
                      />
                    </div>

                    <div className="rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 backdrop-blur-xl">
                      <h3 className="mb-3 text-sm font-bold text-white">Histórico Completo</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[740px] text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                              <th className="py-2">Sem / Data</th>
                              <th className="py-2">Peso</th>
                              <th className="py-2">BF%</th>
                              <th className="py-2">FCR</th>
                              <th className="py-2">Tórax</th>
                              <th className="py-2">Cintura</th>
                              <th className="py-2">Abdômen</th>
                              <th className="py-2">Quadril</th>
                              <th className="py-2">Braço D/E</th>
                              <th className="py-2">Coxa D/E</th>
                              <th className="py-2 text-right">Ação</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/70">
                            {[...state.records].reverse().map((r) => (
                              <tr key={r.id}>
                                <td className="py-2 font-semibold text-white">
                                  S{r.week || '?'} • {r.date}
                                </td>
                                <td className="py-2 font-bold text-[#00e5ff]">{r.weight} kg</td>
                                <td className="py-2 font-bold text-teal-300">
                                  {r.bodyFat ? `${r.bodyFat}%` : '—'}
                                </td>
                                <td className="py-2 text-slate-300">{r.rhr || '—'}</td>
                                <td className="py-2 text-slate-300">{r.chest || '—'}</td>
                                <td className="py-2 text-cyan-200">{r.waist || '—'}</td>
                                <td className="py-2 text-cyan-200">{r.abdomen || '—'}</td>
                                <td className="py-2 text-slate-300">{r.hip || '—'}</td>
                                <td className="py-2 text-slate-300">
                                  {r.armR || '—'} / {r.armL || '—'}
                                </td>
                                <td className="py-2 text-slate-300">
                                  {r.thighR || '—'} / {r.thighL || '—'}
                                </td>
                                <td className="py-2 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (state.records.length <= 1) return;
                                      setState((prev) => ({
                                        ...prev,
                                        records: prev.records.filter((item) => item.id !== r.id)
                                      }));
                                    }}
                                    className="rounded-lg p-1 text-rose-300 hover:bg-rose-500/15"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'skinfold' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 backdrop-blur-xl">
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <Crosshair className="h-5 w-5 text-[#00e5ff]" />
                        <h2 className="text-base font-bold text-white">
                          Calculadora de Adipômetro (Jackson & Pollock + Equação de Siri)
                        </h2>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {activeProtocolObj.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <select
                        value={state.skinfold.protocolId}
                        onChange={(e) => {
                          const pid = e.target.value;
                          const proto = SKINFOLD_PROTOCOLS[pid];
                          setState((prev) => ({
                            ...prev,
                            profile: {
                              ...prev.profile,
                              sex:
                                pid === 'jp3_female'
                                  ? 'female'
                                  : pid === 'jp3_male'
                                  ? 'male'
                                  : prev.profile.sex
                            },
                            skinfold: {
                              ...prev.skinfold,
                              protocolId: pid,
                              selectedSiteId: proto.sites[0]
                            }
                          }));
                        }}
                        className="rounded-xl border border-[#00e5ff]/35 bg-slate-950/90 px-3 py-2 text-xs font-bold text-cyan-200 outline-none"
                      >
                        {Object.values(SKINFOLD_PROTOCOLS).map((pr) => (
                          <option key={pr.id} value={pr.id} className="bg-[#08132b] text-white">
                            {pr.name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={state.profile.sex}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            profile: { ...prev.profile, sex: e.target.value }
                          }))
                        }
                        className="rounded-xl border border-slate-700 bg-slate-950/85 px-3 py-2 text-xs font-bold text-white outline-none"
                      >
                        <option value="male">Sexo: Masculino</option>
                        <option value="female">Sexo: Feminino</option>
                      </select>

                      <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950/85 px-3 py-1.5">
                        <span className="text-xs text-slate-400">Idade:</span>
                        <input
                          type="number"
                          min="15"
                          max="90"
                          value={state.profile.age}
                          onChange={(e) =>
                            setState((prev) => ({
                              ...prev,
                              profile: { ...prev.profile, age: Number(e.target.value) || 30 }
                            }))
                          }
                          className="w-12 bg-transparent text-right text-xs font-bold text-[#00e5ff] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                  <div className="space-y-3 rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 backdrop-blur-xl lg:col-span-4">
                    <h3 className="text-sm font-bold text-white">
                      1. Espessura das Pregas Cutâneas (mm)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Clique em qualquer dobra para iluminar o ponto anatômico exato no mapa ao lado.
                    </p>

                    <div className="space-y-2.5 pt-1">
                      {activeProtocolObj.sites.map((siteKey) => {
                        const site = SKINFOLD_SITES[siteKey];
                        const isSelected = state.skinfold.selectedSiteId === siteKey;
                        return (
                          <div
                            key={siteKey}
                            onClick={() =>
                              setState((prev) => ({
                                ...prev,
                                skinfold: { ...prev.skinfold, selectedSiteId: siteKey }
                              }))
                            }
                            className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 transition ${
                              isSelected
                                ? 'border-[#00e5ff] bg-cyan-500/15'
                                : 'border-slate-800 bg-slate-950/65 hover:border-slate-700'
                            }`}
                          >
                            <div>
                              <span className="block text-xs font-bold text-white">{site.name}</span>
                              <span className="text-[10px] text-[#00e5ff]">
                                {site.direction.split(' ')[0]} • Vista {site.view === 'front' ? 'Frontal' : 'Dorsal'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                step="0.5"
                                min="0"
                                max="80"
                                value={state.skinfold.folds[siteKey] ?? ''}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : Number(e.target.value);
                                  setState((prev) => ({
                                    ...prev,
                                    skinfold: {
                                      ...prev.skinfold,
                                      selectedSiteId: siteKey,
                                      folds: { ...prev.skinfold.folds, [siteKey]: val }
                                    }
                                  }));
                                }}
                                className="w-20 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-right text-sm font-extrabold text-[#00e5ff] outline-none focus:border-[#00e5ff]"
                              />
                              <span className="text-xs text-slate-400">mm</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 space-y-2.5 rounded-2xl border border-teal-400/30 bg-teal-500/10 p-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">Somatório das Dobras (Σ):</span>
                        <strong className="text-white">{skinfoldResults.sum} mm</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">Densidade Corporal (Dc):</span>
                        <strong className="text-cyan-200">
                          {skinfoldResults.density ? `${skinfoldResults.density} g/cm³` : '—'}
                        </strong>
                      </div>
                      <div className="flex items-baseline justify-between border-t border-teal-400/20 pt-2">
                        <span className="text-xs font-bold text-teal-200">% Gordura (Siri):</span>
                        <span className="text-2xl font-extrabold text-teal-300">
                          {skinfoldResults.bodyFatPct !== null ? `${skinfoldResults.bodyFatPct}%` : '—'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                        <div className="rounded-lg bg-slate-950/70 p-2 text-center">
                          <span className="block text-[10px] text-slate-400">Massa Magra</span>
                          <strong className="text-[#00e5ff]">
                            {skinfoldResults.leanMassKg !== null ? `${skinfoldResults.leanMassKg} kg` : '—'}
                          </strong>
                        </div>
                        <div className="rounded-lg bg-slate-950/70 p-2 text-center">
                          <span className="block text-[10px] text-slate-400">Massa Gorda</span>
                          <strong className="text-amber-300">
                            {skinfoldResults.fatMassKg !== null ? `${skinfoldResults.fatMassKg} kg` : '—'}
                          </strong>
                        </div>
                      </div>
                      <div className="text-center text-[11px] font-semibold text-cyan-200">
                        Classificação: {skinfoldResults.classification}
                      </div>

                      <button
                        type="button"
                        onClick={handleSaveSkinfoldToHistory}
                        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:opacity-95"
                        style={{ background: 'linear-gradient(135deg, #00e5ff 0%, #14b8a6 100%)' }}
                      >
                        <BookmarkCheck className="h-4 w-4" />
                        Salvar no Histórico Integrado
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-between rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 backdrop-blur-xl lg:col-span-4">
                    <div className="w-full text-center">
                      <h3 className="text-sm font-bold text-white">
                        2. Mapa Anatômico de Pontos Exatos
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Clique nos marcadores anatômicos para inspecionar a técnica de pinçamento.
                      </p>
                    </div>

                    <div className="my-2 w-full">
                      <AnatomicalSkinfoldMapSVG
                        activeSites={activeProtocolObj.sites}
                        selectedSiteId={selectedSiteObj.id}
                        onSelectSite={(siteId) =>
                          setState((prev) => ({
                            ...prev,
                            skinfold: { ...prev.skinfold, selectedSiteId: siteId }
                          }))
                        }
                      />
                    </div>

                    <div className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-2.5 text-center text-[11px] text-slate-300">
                      Hemicorpo padrão ISAK/ACSM: <strong>Lado Direito</strong> do avaliado.
                    </div>
                  </div>

                  <div className="space-y-4 rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 backdrop-blur-xl lg:col-span-4">
                    <div className="border-b border-slate-800 pb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#00e5ff]">
                        3. Guia Técnico de Coleta (ISAK / Pollock)
                      </span>
                      <h3 className="mt-0.5 text-lg font-extrabold text-white">
                        Prega {selectedSiteObj.name}
                      </h3>
                    </div>

                    <div className="space-y-3 text-xs leading-relaxed">
                      <div className="rounded-xl border border-[#00e5ff]/25 bg-cyan-500/10 p-3.5">
                        <span className="mb-1 block font-bold text-cyan-200">
                          Localização Anatômica Exata
                        </span>
                        <p className="text-slate-200">{selectedSiteObj.location}</p>
                      </div>

                      <div className="rounded-xl bg-slate-950/75 p-3.5">
                        <span className="mb-1 block font-bold text-teal-300">
                          Direção & Eixo da Prega
                        </span>
                        <p className="text-slate-300">{selectedSiteObj.direction}</p>
                      </div>

                      <div className="rounded-xl bg-slate-950/75 p-3.5">
                        <span className="mb-1 block font-bold text-white">
                          Técnica de Pinçamento com Adipômetro
                        </span>
                        <p className="text-slate-300">{selectedSiteObj.technique}</p>
                      </div>

                      <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-3.5">
                        <span className="mb-1 block font-bold text-amber-200">
                          Erros Comuns a Evitar
                        </span>
                        <p className="text-amber-100/90">{selectedSiteObj.commonErrors}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ================================================================= */}
        {/* MÓDULO 4: CLÍNICA & FÁRMACOS                                      */}
        {/* ================================================================= */}
        {activeModule === 'clinical' && (
          <div className="space-y-6">
            <div className="flex items-start gap-3.5 rounded-2xl border border-[#00e5ff]/35 bg-cyan-500/10 p-4 backdrop-blur-xl">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#00e5ff]" />
              <div className="text-xs leading-relaxed text-cyan-100">
                <strong className="block text-sm font-bold text-white">
                  Base Clínica & Simulador Educacional — 14 Agentes Regulamentados (ANVISA / FDA)
                </strong>
                Conteúdo fundamentado em bulas oficiais e ensaios clínicos (STEP, SURMOUNT, SCALE,
                REWIND, UKPDS, EMPA-REG, JUPITER, XENDOS). Destinado exclusivamente a estudo
                acadêmico e apoio à decisão clínica profissional.
              </div>
            </div>

            {activeSubTab === 'simulator' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 backdrop-blur-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-white">
                        Simulador Farmacocinético Multi-Agente ({state.clinicalStudy.agents.length}/3 Ativos)
                      </h2>
                      <p className="text-xs text-slate-400">
                        Combine fármacos regulamentados, ajuste dose, frequência e semana de início para observar o steady-state.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#00e5ff]" />
                        <span className="text-xs text-slate-400">Horizonte:</span>
                        <select
                          value={state.clinicalStudy.horizonWeeks}
                          onChange={(e) =>
                            setState((prev) => ({
                              ...prev,
                              clinicalStudy: {
                                ...prev.clinicalStudy,
                                horizonWeeks: Number(e.target.value)
                              }
                            }))
                          }
                          className="bg-transparent text-xs font-bold text-cyan-200 outline-none"
                        >
                          <option value={8} className="bg-[#08132b]">8 semanas</option>
                          <option value={12} className="bg-[#08132b]">12 semanas</option>
                          <option value={16} className="bg-[#08132b]">16 semanas</option>
                          <option value={24} className="bg-[#08132b]">24 semanas</option>
                        </select>
                      </div>

                      {state.clinicalStudy.agents.length < 3 && (
                        <button
                          type="button"
                          onClick={() => handleAddDrugToSimulator(REGULATED_DRUGS[0])}
                          className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-950"
                          style={{ background: 'linear-gradient(135deg, #00e5ff 0%, #14b8a6 100%)' }}
                        >
                          <Plus className="h-4 w-4" />
                          Adicionar Fármaco
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {state.clinicalStudy.agents.map((ag, index) => {
                      const drug = REGULATED_DRUGS.find((d) => d.id === ag.drugId) || REGULATED_DRUGS[0];
                      return (
                        <div
                          key={ag.id}
                          className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                          style={{ borderTop: `3px solid ${drug.color}` }}
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <span
                              className="rounded-md px-2 py-0.5 text-[11px] font-bold text-slate-950"
                              style={{ backgroundColor: drug.color }}
                            >
                              Agente #{index + 1} • {drug.route}
                            </span>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setState((prev) => ({
                                    ...prev,
                                    clinicalStudy: {
                                      ...prev.clinicalStudy,
                                      selectedEncyclopediaDrugId: drug.id
                                    }
                                  }));
                                  setActiveSubTab('encyclopedia');
                                }}
                                className="rounded px-2 py-0.5 text-[11px] font-semibold text-[#00e5ff] hover:bg-cyan-500/15"
                              >
                                Ver Bula/Estudos
                              </button>

                              {state.clinicalStudy.agents.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setState((prev) => ({
                                      ...prev,
                                      clinicalStudy: {
                                        ...prev.clinicalStudy,
                                        agents: prev.clinicalStudy.agents.filter((a) => a.id !== ag.id)
                                      }
                                    }))
                                  }
                                  className="rounded p-1 text-rose-300 hover:bg-rose-500/15"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="mb-1 block text-[11px] text-slate-400">
                                Fármaco Regulamentado
                              </label>
                              <select
                                value={ag.drugId}
                                onChange={(e) => {
                                  const selected =
                                    REGULATED_DRUGS.find((d) => d.id === e.target.value) || REGULATED_DRUGS[0];
                                  setState((prev) => ({
                                    ...prev,
                                    clinicalStudy: {
                                      ...prev.clinicalStudy,
                                      agents: prev.clinicalStudy.agents.map((item) =>
                                        item.id === ag.id
                                          ? {
                                              ...item,
                                              drugId: selected.id,
                                              dose: selected.defaultDose,
                                              freqDays: selected.defaultFreqDays
                                            }
                                          : item
                                      )
                                    }
                                  }));
                                }}
                                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs font-bold text-white outline-none focus:border-[#00e5ff]"
                              >
                                {DRUG_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                                  <optgroup key={cat.id} label={cat.label}>
                                    {REGULATED_DRUGS.filter((d) => d.category === cat.id).map((d) => (
                                      <option key={d.id} value={d.id}>
                                        {d.name} ({d.brandNames})
                                      </option>
                                    ))}
                                  </optgroup>
                                ))}
                              </select>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="mb-1 block text-[11px] text-slate-400">
                                  Dose ({drug.unit})
                                </label>
                                <select
                                  value={ag.dose}
                                  onChange={(e) =>
                                    setState((prev) => ({
                                      ...prev,
                                      clinicalStudy: {
                                        ...prev.clinicalStudy,
                                        agents: prev.clinicalStudy.agents.map((item) =>
                                          item.id === ag.id
                                            ? { ...item, dose: Number(e.target.value) }
                                            : item
                                        )
                                      }
                                    }))
                                  }
                                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs font-bold text-cyan-200 outline-none"
                                >
                                  {drug.standardDoses.map((dVal) => (
                                    <option key={dVal} value={dVal}>
                                      {dVal} {drug.unit}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="mb-1 block text-[11px] text-slate-400">Intervalo</label>
                                <select
                                  value={ag.freqDays}
                                  onChange={(e) =>
                                    setState((prev) => ({
                                      ...prev,
                                      clinicalStudy: {
                                        ...prev.clinicalStudy,
                                        agents: prev.clinicalStudy.agents.map((item) =>
                                          item.id === ag.id
                                            ? { ...item, freqDays: Number(e.target.value) }
                                            : item
                                        )
                                      }
                                    }))
                                  }
                                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-white outline-none"
                                >
                                  <option value={0.33}>8h (3x/dia)</option>
                                  <option value={1}>Diária (24h)</option>
                                  <option value={3.5}>3.5 dias</option>
                                  <option value={7}>Semanal (7d)</option>
                                  <option value={14}>Quinzenal (14d)</option>
                                  <option value={21}>Cada 21 dias</option>
                                  <option value={70}>Cada 10 sem.</option>
                                </select>
                              </div>

                              <div>
                                <label className="mb-1 block text-[11px] text-slate-400">Início (Sem.)</label>
                                <input
                                  type="number"
                                  min="1"
                                  max={state.clinicalStudy.horizonWeeks}
                                  value={ag.startWeek}
                                  onChange={(e) =>
                                    setState((prev) => ({
                                      ...prev,
                                      clinicalStudy: {
                                        ...prev.clinicalStudy,
                                        agents: prev.clinicalStudy.agents.map((item) =>
                                          item.id === ag.id
                                            ? { ...item, startWeek: Math.max(1, Number(e.target.value) || 1) }
                                            : item
                                        )
                                      }
                                    }))
                                  }
                                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-2 py-1.5 text-center text-xs font-bold text-white outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 backdrop-blur-xl">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Curva Farmacocinética de Acúmulo & Steady-State (%)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Modelo Bateman + somatório real dos 4 ésteres quando o "Durateston" está selecionado.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      {clinicalSim.series.map((s) => (
                        <span key={s.agentId} className="flex items-center gap-1.5 font-semibold text-slate-200">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.drug.color }} />
                          {s.drug.name} ({s.dose}
                          {s.drug.unit})
                        </span>
                      ))}
                    </div>
                  </div>
                  <MultiAgentPKChartSVG simData={clinicalSim} />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="space-y-3 rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-[#00e5ff]" />
                      <h3 className="text-base font-bold text-white">Interações & Sobreposição</h3>
                    </div>

                    {clinicalSim.alerts.length === 0 ? (
                      <div className="rounded-xl border border-teal-400/25 bg-teal-500/10 p-3.5 text-xs text-teal-100">
                        Nenhuma duplicidade de classe ou interação crítica detectada neste cenário.
                      </div>
                    ) : (
                      clinicalSim.alerts.map((al, i) => (
                        <div
                          key={i}
                          className={`rounded-xl border p-3.5 text-xs leading-relaxed ${
                            al.level === 'high'
                              ? 'border-rose-400/40 bg-rose-500/10 text-rose-100'
                              : al.level === 'medium'
                              ? 'border-amber-400/40 bg-amber-500/10 text-amber-100'
                              : 'border-[#00e5ff]/30 bg-cyan-500/10 text-cyan-100'
                          }`}
                        >
                          <div className="mb-1 flex items-center gap-1.5 font-bold">
                            {al.level === 'info' ? (
                              <Info className="h-4 w-4 shrink-0" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 shrink-0" />
                            )}
                            <span>{al.title}</span>
                          </div>
                          <p>{al.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="space-y-4 lg:col-span-2">
                    {clinicalSim.series.map((s) => (
                      <div
                        key={s.agentId}
                        className="rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-5 backdrop-blur-xl"
                      >
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                          <div>
                            <h4 className="text-sm font-extrabold text-white">
                              Evolução Temporal Esperada: {s.drug.name}{' '}
                              <span className="text-[#00e5ff]">{s.drug.brandNames}</span>
                            </h4>
                            <span className="text-[11px] text-slate-400">
                              Steady-state estimado em ~{s.steadyStateDays} dias ({s.steadyStateWeek} semanas)
                            </span>
                          </div>
                          <span
                            className="rounded-lg px-2.5 py-1 text-xs font-bold text-slate-950"
                            style={{ backgroundColor: s.drug.color }}
                          >
                            {s.dose} {s.drug.unit}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 text-xs sm:grid-cols-3">
                          <div className="rounded-xl bg-slate-950/70 p-3">
                            <span className="block font-bold text-[#00e5ff]">Semanas 1 a 2</span>
                            <p className="mt-1 leading-relaxed text-slate-300">
                              {s.drug.timelineEffects.w1_2}
                            </p>
                          </div>
                          <div className="rounded-xl bg-slate-950/70 p-3">
                            <span className="block font-bold text-teal-300">Semanas 4 a 8</span>
                            <p className="mt-1 leading-relaxed text-slate-300">
                              {s.drug.timelineEffects.w4_8}
                            </p>
                          </div>
                          <div className="rounded-xl bg-slate-950/70 p-3">
                            <span className="block font-bold text-sky-300">Semana 12+</span>
                            <p className="mt-1 leading-relaxed text-slate-300">
                              {s.drug.timelineEffects.w12_plus}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'encyclopedia' && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-3 rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-4 backdrop-blur-xl lg:col-span-4">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#00e5ff]" />
                    <input
                      type="text"
                      placeholder='Buscar "Mounjaro", "Durateston", "Ozempic"...'
                      value={state.clinicalStudy.searchQuery || ''}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          clinicalStudy: { ...prev.clinicalStudy, searchQuery: e.target.value }
                        }))
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/90 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-400 outline-none focus:border-[#00e5ff]"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {DRUG_CATEGORIES.map((cat) => {
                      const active = (state.clinicalStudy.selectedCategory || 'all') === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              clinicalStudy: { ...prev.clinicalStudy, selectedCategory: cat.id }
                            }))
                          }
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                            active
                              ? 'bg-[#00e5ff] text-slate-950'
                              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="max-h-[620px] space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
                    {filteredEncyclopediaDrugs.map((drug) => {
                      const isSelected = selectedEncyclopediaDrug?.id === drug.id;
                      return (
                        <button
                          key={drug.id}
                          type="button"
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              clinicalStudy: {
                                ...prev.clinicalStudy,
                                selectedEncyclopediaDrugId: drug.id
                              }
                            }))
                          }
                          className={`w-full rounded-xl border p-3 text-left transition ${
                            isSelected
                              ? 'border-[#00e5ff] bg-cyan-500/15 shadow-md'
                              : 'border-slate-800 bg-slate-950/65 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {drug.categoryLabel.split('&')[0]}
                            </span>
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: drug.color }}
                            />
                          </div>
                          <div className="mt-0.5 text-xs font-extrabold text-white">{drug.name}</div>
                          <div className="text-[11px] font-bold text-[#00e5ff]">{drug.brandNames}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedEncyclopediaDrug && (
                  <div className="space-y-4 rounded-2xl border border-[#00e5ff]/20 bg-[#08132b]/85 p-6 backdrop-blur-xl lg:col-span-8">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
                      <div>
                        <span
                          className="text-xs font-extrabold uppercase tracking-wider"
                          style={{ color: selectedEncyclopediaDrug.color }}
                        >
                          {selectedEncyclopediaDrug.drugClass}
                        </span>
                        <h2 className="mt-1 text-xl font-extrabold text-white">
                          {selectedEncyclopediaDrug.name}{' '}
                          <span className="text-[#00e5ff]">{selectedEncyclopediaDrug.brandNames}</span>
                        </h2>
                        <p className="mt-1 text-xs text-slate-400">
                          Via: <strong className="text-slate-200">{selectedEncyclopediaDrug.route}</strong> •
                          Doses de referência:{' '}
                          <strong className="text-slate-200">
                            {selectedEncyclopediaDrug.standardDoses.join(' / ')} {selectedEncyclopediaDrug.unit}
                          </strong>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddDrugToSimulator(selectedEncyclopediaDrug)}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:opacity-95"
                        style={{ background: 'linear-gradient(135deg, #00e5ff 0%, #14b8a6 100%)' }}
                      >
                        <Plus className="h-4 w-4" />
                        Enviar ao Simulador
                      </button>
                    </div>

                    <div className="rounded-xl border border-[#00e5ff]/25 bg-cyan-500/10 p-4 text-xs leading-relaxed">
                      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-white">
                        <Target className="h-4 w-4 text-[#00e5ff]" />
                        1. Para que serve (Indicações Clínicas Aprovadas em Bula)
                      </span>
                      <p className="text-cyan-50">{selectedEncyclopediaDrug.indications}</p>
                    </div>

                    <div className="rounded-xl bg-slate-950/75 p-4 text-xs leading-relaxed">
                      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-teal-300">
                        <FlaskConical className="h-4 w-4" />
                        2. Como age no organismo (Mecanismo Farmacodinâmico Detalhado)
                      </span>
                      <p className="text-slate-200">{selectedEncyclopediaDrug.mechanism}</p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/65 p-4 text-xs">
                      <span className="mb-2.5 block text-sm font-bold text-white">
                        3. Perfil Farmacocinético (ADME)
                      </span>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-lg bg-slate-900/90 p-2.5">
                          <span className="block text-[10px] uppercase text-slate-400">
                            Meia-Vida de Eliminação (t½)
                          </span>
                          <strong className="text-[#00e5ff]">
                            {selectedEncyclopediaDrug.halfLifeHours} horas (~
                            {selectedEncyclopediaDrug.halfLifeDays} dias)
                          </strong>
                        </div>
                        <div className="rounded-lg bg-slate-900/90 p-2.5">
                          <span className="block text-[10px] uppercase text-slate-400">
                            Tempo até Pico Plasmático (Tmáx)
                          </span>
                          <strong className="text-teal-300">{selectedEncyclopediaDrug.tmaxText}</strong>
                        </div>
                        <div className="rounded-lg bg-slate-900/90 p-2.5">
                          <span className="block text-[10px] uppercase text-slate-400">
                            Biodisponibilidade
                          </span>
                          <strong className="text-slate-200">
                            {selectedEncyclopediaDrug.bioavailability}
                          </strong>
                        </div>
                        <div className="rounded-lg bg-slate-900/90 p-2.5">
                          <span className="block text-[10px] uppercase text-slate-400">
                            Tempo até Estado Estacionário
                          </span>
                          <strong className="text-cyan-200">
                            ~{(selectedEncyclopediaDrug.halfLifeDays * 4.5).toFixed(1)} dias
                          </strong>
                        </div>
                      </div>
                      <p className="mt-2.5 text-[11px] text-slate-400">
                        <strong className="text-slate-300">Metabolismo & Excreção:</strong>{' '}
                        {selectedEncyclopediaDrug.metabolismExcretion}
                      </p>
                    </div>

                    <div className="rounded-xl border border-teal-400/25 bg-teal-500/10 p-4 text-xs leading-relaxed">
                      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-teal-200">
                        <FileText className="h-4 w-4" />
                        4. Evidências de Ensaios Clínicos & Desfechos Reais
                      </span>
                      <pre className="whitespace-pre-wrap font-sans text-slate-100">
                        {selectedEncyclopediaDrug.clinicalStudies}
                      </pre>
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
                      <div className="rounded-xl bg-slate-950/75 p-3.5">
                        <span className="mb-1 block font-bold text-amber-300">
                          Reações Adversas de Bula
                        </span>
                        <p className="leading-relaxed text-slate-300">
                          {selectedEncyclopediaDrug.sideEffects}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-950/75 p-3.5">
                        <span className="mb-1 block font-bold text-rose-300">
                          Contraindicações
                        </span>
                        <p className="leading-relaxed text-slate-300">
                          {selectedEncyclopediaDrug.contraindications}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-950/75 p-3.5">
                        <span className="mb-1 block font-bold text-[#00e5ff]">
                          Monitoramento Laboratorial
                        </span>
                        <p className="leading-relaxed text-slate-300">
                          {selectedEncyclopediaDrug.labMonitoring}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
