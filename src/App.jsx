import React, { useState, useEffect, useMemo } from "react";
import {
  Activity,
  Flame,
  Scale,
  Pill,
  Utensils,
  Repeat,
  Plus,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Layers,
  Calendar,
  BookOpen,
  Ruler,
  Sliders,
  Search,
  ChevronRight,
  Info,
  ShieldAlert,
  Stethoscope,
  Sparkles,
  UserCheck,
  ArrowUpRight,
} from "lucide-react";

const STORAGE_KEY = "nexus_protocol_state_v3";

// ============================================================================
// BASE DE DADOS CIENTÍFICA — 14 FÁRMACOS E HORMÔNIOS REGULAMENTADOS
// ============================================================================
const REGULATED_DRUGS = [
  // 1. PEPTÍDEOS METABÓLICOS & INCRETINAS
  {
    id: "semaglutide",
    name: "Semaglutida",
    famousNames: ["Ozempic", "Wegovy", "Rybelsus"],
    category: "Peptídeos Metabólicos & Incretinas",
    classLabel: "Agonista de Receptor GLP-1",
    regulatoryStatus: "Aprovado (ANVISA / FDA)",
    defaultDose: 1.0,
    unit: "mg",
    minDose: 0.25,
    maxDose: 2.4,
    stepDose: 0.25,
    intervalDays: 7,
    halfLifeHours: 168,
    tmaxHours: 36,
    potencyFactor: 1.05,
    color: "#22D3EE",
    summary:
      "Análogo de GLP-1 com 94% de homologia ao GLP-1 humano e resistência à degradação pela DPP-4, promovendo saciedade central, redução do esvaziamento gástrico e secreção de insulina dependente de glicose.",
    mechanismOfAction:
      "Liga-se seletivamente aos receptores GLP-1 no hipotálamo (núcleo arqueado) e tronco encefálico, reduzindo o apetite e a ingestão calórica espontânea. No pâncreas, amplifica a liberação de insulina glicose-dependente e suprime a secreção inapropriada de glucagon pós-prandial, além de retardar o esvaziamento gástrico.",
    clinicalTrials:
      "Nos ensaios STEP 1–4 (obesidade sem diabetes), semaglutida 2,4 mg associada a intervenção no estilo de vida promoveu perda média de ~14,9% a 17,4% do peso corporal em 68 semanas vs. ~2,4% no placebo. No SUSTAIN e PIONEER (DM2), reduziu HbA1c em ~1,2% a 1,8% e demonstrou benefício cardiovascular no SELECT em pacientes com doença cardiovascular estabelecida.",
    pkNotes:
      "Meia-vida de eliminação ~7 dias (168 h); estado estacionário (steady state) atingido após ~4 a 5 semanas de doses semanais constantes. Escalonamento gradual a cada 4 semanas reduz efeitos gastrointestinais.",
    sideEffects:
      "Náuseas, plenitude gástrica, refluxo, constipação ou diarreia (mais comuns nas primeiras semanas ou após aumento de dose). Risco raro de pancreatite aguda e colelitíase em perdas ponderais rápidas.",
    contraindications:
      "Histórico pessoal ou familiar de carcinoma medular de tireoide (CMT) ou neoplasia endócrina múltipla tipo 2 (NEM 2); gestação e lactação; hipersensibilidade ao princípio ativo.",
    labMonitoring:
      "HbA1c, glicemia de jejum, perfil lipídico, função renal (creatinina/TFG — atenção à desidratação por vômitos/diarreia), amilase/lipase se dor abdominal persistente e ultrassom se sintomas biliares.",
    timelineImpact: {
      early: "Redução marcante do apetite e saciedade precoce; possível náusea leve ou desconforto gástrico.",
      mid: "Déficit calórico sustentado com perda ponderal progressiva e melhora da resposta glicêmica.",
      late: "Consolidação da redução de massa gorda; exigência de aporte proteico e treino resistido para preservar massa magra.",
    },
  },
  {
    id: "tirzepatide",
    name: "Tirzepatida",
    famousNames: ["Mounjaro", "Zepbound"],
    category: "Peptídeos Metabólicos & Incretinas",
    classLabel: "Agonista Duplo de Receptores GIP e GLP-1",
    regulatoryStatus: "Aprovado (ANVISA / FDA)",
    defaultDose: 5.0,
    unit: "mg",
    minDose: 2.5,
    maxDose: 15.0,
    stepDose: 2.5,
    intervalDays: 7,
    halfLifeHours: 120,
    tmaxHours: 24,
    potencyFactor: 1.35,
    color: "#38BDF8",
    summary:
      "Agonista duplo sintético dos receptores de GIP (polipeptídeo insulinotrópico dependente de glicose) e GLP-1, com afinidade diferenciada que potencializa a sensibilidade insulínica e a redução ponderal.",
    mechanismOfAction:
      "Combina a ativação dos receptores GLP-1 (saciedade central, controle de glucagon e esvaziamento gástrico) com a ativação dos receptores GIP no tecido adiposo e sistema nervoso central, melhorando a sensibilidade à insulina e o metabolismo lipídico.",
    clinicalTrials:
      "No SURMOUNT-1 (72 semanas), doses de 5 mg, 10 mg e 15 mg resultaram em reduções médias de peso corporal de ~15,0%, 19,5% e 20,9%, respectivamente, frente a ~3,1% no placebo. No SURPASS, superou comparadores como semaglutida 1 mg e insulina degludeca na redução de HbA1c e peso em DM2.",
    pkNotes:
      "Meia-vida média de ~5 dias (120 h), permitindo administração subcutânea semanal. Pico plasmático em ~8 a 72 horas (mediana ~24 h); estado estacionário alcançado em cerca de 4 semanas.",
    sideEffects:
      "Náuseas, diarreia, redução do apetite, vômitos, constipação, dispepsia e dor abdominal, sobretudo durante a titulação de dose.",
    contraindications:
      "Histórico pessoal ou familiar de CMT ou NEM 2; gestação e lactação; pancreatite pré

