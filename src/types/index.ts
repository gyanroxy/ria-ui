export type RoleKey = 'OW' | 'CM' | 'CE' | 'AC' | 'PA' | 'TA';

export interface RoleInfo {
  k: RoleKey;
  n: string;
  sub: string;
}

export type PermissionLevel = 'F' | 'A' | 'V' | 'X';

export type ScreenKey =
  | 'login'
  | 'dashboard'
  | 'collections'
  | 'retailers'
  | 'calls'
  | 'calldetail'
  | 'reschedule'
  | 'tickets'
  | 'escalations'
  | 'contacts';

export type ViewState = 'normal' | 'loading' | 'empty' | 'error' | 'offline';

export interface NavItem {
  k: ScreenKey;
  t: string;
  ic: string;
  scr: string;
  badge?: number;
}

export interface CampaignContact {
  id: string;
  name: string;
  phno: string;
  creditPeriod: string;
  addedAt?: string;
}

export interface EscalationItem {
  id: string;
  category: string;
  customer: string;
  severity: 'High' | 'Medium' | 'Low';
  owner: string;
  age: string;
  sourceCallId: string;
  status: 'Open' | 'Resolved';
  resolutionNote?: string;
}

export type Ticket = EscalationItem;

export interface CallBatch {
  id: string;
  name: string;
  createdAt: string;
  importedBy: string;
  fileName: string;
  totalCalls: number;
  completedCalls: number;
  connectedCalls: number;
  ptpCount: number;
  ptpAmount: number;
  disputeCount: number;
  noLiftCount: number;
  status: 'Completed' | 'In Progress' | 'Scheduled';
  calls: CallItem[];
}

export interface ScheduledCallbackItem {
  id: string;
  ret: string;
  name: string;
  ph: string;
  outstanding: number;
  type: 'customer_requested' | 'no_lift_retry' | 'busy_retry';
  priority: 'High' | 'Medium' | 'Normal';
  scheduledTime: string;
  relativeDue: string;
  isDueNow?: boolean;
  attempt: number;
  maxAttempts: number;
  aiNote: string;
  status: 'Queued' | 'Dialing' | 'Completed' | 'Exhausted' | 'Cancelled';
  sourceCallId: string;
  lastOutcome?: string;
}

export interface Retailer {
  id: string;
  name: string;
  code: string;
  city: string;
  owner: string;
  phone: string;
  lang: string;
  bucket: string;
  os: number;
  od: number;
  lim: number;
  lastCall: string;
  ptp: string;
  disp: string;
  score: number;
  auto: string;
  creditPeriod?: string;
  history?: Array<{
    d: string;
    typ: string;
    dur: string;
    disp: string;
    rec: string;
  }>;
  invoices?: Array<{
    inv: string;
    amt: number;
    due: string;
    st: string;
  }>;
}

export interface TranscriptTurn {
  who: string;
  txt: string;
  lang: string;
}

export interface CallItem {
  id: string;
  ret: string;
  name: string;
  ph: string;
  time: string;
  lang: string;
  dur: string;
  disp: string;
  ptp: string;
  auto: string;
  audio: string;
  score: number;
  turns: TranscriptTurn[];
  batchId?: string;
}

export interface PtpItem {
  id: string;
  ret: string;
  name: string;
  due: string;
  amt: number;
  st: 'due' | 'upcoming' | 'kept' | 'broken';
  auto: string;
  ph: string;
}

export interface NoLiftItem {
  ret: string;
  name: string;
  att: number;
  last: string;
  next: string;
  auto: string;
  ph: string;
}

export interface ResponseStat {
  k: string;
  l: string;
  n: number;
  c: string;
  d: string;
}

export interface OtherResponseItem {
  ret: string;
  name: string;
  disp: string;
  det: string;
  auto: string;
  c: string;
}

export interface CustomerCareContact {
  n: string;
  r: string;
  p: string;
  e: string;
  h: string;
}

export interface UserItem {
  id: string;
  n: string;
  e: string;
  role: RoleKey;
  ph: string;
  st: string;
}

export interface TrendItem {
  d: string;
  placed: number;
  conn: number;
  ptp: number;
}

export interface RecoveryItem {
  d: string;
  dem: number;
  rec: number;
}

export interface VoiceProvider {
  k: string;
  n: string;
  d: string;
  cost: string;
  lat: string;
  creds: string[];
}

export interface PhoneNumberItem {
  num: string;
  lbl: string;
  pri: boolean;
  on: boolean;
}

export interface AppConfig {
  provider: string;
  creds: Record<string, Record<string, string>>;
  numbers: PhoneNumberItem[];
  voice: {
    voice: string;
    speed: number;
    pitch: number;
    punct: boolean;
    noise: boolean;
    lang: string;
  };
  rules: {
    cap: number;
    starthour: string;
    endhour: string;
    cooldown: number;
    ptpwindow: number;
    escalate: number;
    blockdispute: boolean;
    blockholiday: boolean;
  };
  general: {
    tenant: string;
    gstin: string;
    callerid: string;
    audiodays: number;
    auditdays: number;
    webhook: string;
    escalateemail: string;
    escalatesms: string;
  };
}

export interface ImportHistoryItem {
  d: string;
  rows: number;
  rej: number;
  fn: string;
  by: string;
}

export interface ReportItem {
  k: string;
  n: string;
  d: string;
  fmt: string;
  fn: string;
}
