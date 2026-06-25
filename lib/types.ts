export interface Demographic {
  name: string;
  age: string;
  sex: string;
  addr: string;
  occ: string;
}

export interface Complaint {
  text: string;
  durNum: string;
  durUnit: string;
}

export interface PastHistory {
  sim: string;
  cond: string;
  surg: string;
  rf: string;
  dm: string;
  htn: string;
  tb: string;
  ibd: string;
}

export interface FamilyHistory {
  det: string;
  htn_dm: string;
  cardiac: string;
  malignancy: string;
  other: string;
}

export interface PersonalHistory {
  sm: string;
  al: string;
  dt: string;
  mn: string;
  sexual: string;
  occ_hx: string;
}

export interface DrugHistory {
  cur: string;
  allergies: string;
  otc: string;
  herbal: string;
}

export interface Vitals {
  pu: string;
  bp: string;
  rr: string;
  tp: string;
  o2: string;
  jv: string;
}

export interface Signs {
  pallor: boolean;
  icterus: boolean;
  clubbing: boolean;
  cyanosis: boolean;
  oedema: boolean;
  lymph: boolean;
  febrile: boolean;
}

export interface ChatMessage {
  r: "u" | "a";
  c: string;
}

export interface AiOutcomes {
  differentials: string;
  investigations: string;
  management: string;
  summary: string;
}

export interface PrescriptionItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  instructions: string;
}

export interface Patient {
  id: number;
  createdAt: string;
  status: "new" | "in-progress" | "complete";
  demo: Demographic;
  cc: Complaint[];
  hxPhase: "hpi" | "sysHx";
  hpiOpen: Record<number, boolean>;
  hpiData: Record<number, Record<string, string | string[]>>;
  customHpi: Record<number, string>;
  selectedSystems: string[];
  sysData: Record<string, Record<string, string>>;
  sysPos: Record<string, boolean>;
  sysNeg: Record<string, boolean>;
  sysRisk: Record<string, boolean>;
  sysExtra: Record<string, Record<string, string>>;
  past: PastHistory;
  fam: FamilyHistory;
  per: PersonalHistory;
  drg: DrugHistory;
  vit: Vitals;
  sgn: Signs;
  exSystems: string[];
  exData: Record<string, {
    I?: Record<string, string>;
    P?: Record<string, string>;
    Pe?: Record<string, string>;
    A?: Record<string, string>;
    [key: string]: Record<string, string> | undefined;
  }>;
  summaryLoading: boolean;
  summaryText: string;
  summaryGenerated: boolean;
  provisionalDx: string;
  chat: ChatMessage[];
  aiTab: string;
  aiOut: AiOutcomes;
  loading: boolean;
  bgTab?: string;
  activeSysHxTab?: string;
  activeExTab?: string;
  diagnosis?: string;
  prescribedInvestigations?: string;
  managementPlan?: string;
  prescriptions?: PrescriptionItem[];
}

export interface Step {
  id: string;
  lb: string;
  ic: string;
}
