import {
  RoleKey,
  RoleInfo,
  PermissionLevel,
  NavItem,
  Retailer,
  CallItem,
  PtpItem,
  NoLiftItem,
  ResponseStat,
  OtherResponseItem,
  EscalationItem,
  CustomerCareContact,
  UserItem,
  TrendItem,
  RecoveryItem,
  VoiceProvider,
  AppConfig,
  ImportHistoryItem,
  ReportItem,
  CampaignContact,
  CallBatch,
  ScheduledCallbackItem,
} from '@/types';

export const ROLES: Record<RoleKey, RoleInfo> = {
  OW: { k: 'OW', n: 'Distributor Owner', sub: 'Full access — approvals, billing, contacts' },
  CM: { k: 'CM', n: 'Credit / Collection Manager', sub: 'Day-to-day collection queue, dispute reviews' },
  CE: { k: 'CE', n: 'Collection Executive / Field Agent', sub: 'Assigned accounts, field visits, PTP tracking' },
  AC: { k: 'AC', n: 'Accountant', sub: 'Payment matching, ledger updates, invoice reconciliation' },
  PA: { k: 'PA', n: 'Principal Auditor', sub: 'Read-only compliance, dispute and audit trail reviews' },
  TA: { k: 'TA', n: 'Tenant Admin', sub: 'User management, contacts, role assignment' },
};

export const PERM: Record<string, Record<RoleKey, PermissionLevel>> = {
  dashboard:   { OW: 'F', CM: 'F', CE: 'V', AC: 'F', PA: 'V', TA: 'F' },
  collections: { OW: 'F', CM: 'F', CE: 'F', AC: 'V', PA: 'V', TA: 'V' },
  calls:       { OW: 'F', CM: 'F', CE: 'V', AC: 'X', PA: 'V', TA: 'F' },
  calldetail:  { OW: 'F', CM: 'F', CE: 'V', AC: 'V', PA: 'V', TA: 'F' },
  reschedule:  { OW: 'F', CM: 'F', CE: 'F', AC: 'V', PA: 'V', TA: 'F' },
  retailers:   { OW: 'F', CM: 'F', CE: 'F', AC: 'V', PA: 'V', TA: 'F' },
  tickets:     { OW: 'F', CM: 'F', CE: 'F', AC: 'F', PA: 'V', TA: 'F' },
  escalations: { OW: 'F', CM: 'F', CE: 'F', AC: 'F', PA: 'V', TA: 'F' },
  contacts:    { OW: 'F', CM: 'F', CE: 'F', AC: 'F', PA: 'V', TA: 'F' },
};

export const NAV: NavItem[] = [
  { k: 'dashboard', t: 'Dashboard', ic: '⌂', scr: 'SCR-02' },
  { k: 'collections', t: 'Collections', ic: '₹', scr: 'SCR-03', badge: 4 },
  { k: 'calls', t: 'Calls', ic: '☏', scr: 'SCR-05' },
  { k: 'reschedule', t: 'Reschedule', ic: '⏰', scr: 'SCR-17', badge: 5 },
  { k: 'tickets', t: 'Tickets', ic: '⚑', scr: 'SCR-11', badge: 4 },
  { k: 'contacts', t: 'Contacts', ic: '📇', scr: 'SCR-16' },
];

export const TITLES: Record<string, [string, string, string]> = {
  dashboard: ['SCR-02', 'Dashboard', 'Graphs, downloadable reports and everyone who uses RIA.'],
  collections: ['SCR-03', 'Collections', 'Promises to pay, calls not lifted, and how every retailer responded today.'],
  calls: ['SCR-05', 'Calls', 'Import the daily call list as a CSV and follow every call through the day.'],
  calldetail: ['SCR-06', 'Call Detail', 'The evidential record of one call.'],
  reschedule: ['SCR-17', 'Reschedule & Callback Queue', 'Autonomous 5-min retries for unlifted calls and customer-requested callback time slots.'],
  retailers: ['SCR-04', 'Retailer 360', 'Everything known about one retailer, and what to do next.'],
  tickets: ['SCR-11', 'Tickets', 'Everything RIA could not, or should not, handle alone.'],
  escalations: ['SCR-11', 'Tickets', 'Everything RIA could not, or should not, handle alone.'],
  contacts: ['SCR-16', 'Contacts', 'All customer accounts and retailers added across all campaigns so far.'],
};

export const ESCALATIONS: EscalationItem[] = [
  {
    id: 'E-311',
    category: 'Dispute raised',
    customer: 'Venkateswara Traders',
    severity: 'High',
    owner: 'Unassigned',
    age: '2 d 4 h',
    sourceCallId: 'CL-4390',
    status: 'Open',
  },
  {
    id: 'E-310',
    category: 'Already-paid claim',
    customer: 'RK Motors',
    severity: 'Medium',
    owner: 'Accounts — Priya',
    age: '3 h',
    sourceCallId: 'CL-4414',
    status: 'Open',
  },
  {
    id: 'E-309',
    category: 'Low model confidence',
    customer: 'MAK Spares',
    severity: 'Medium',
    owner: 'CM — Ramesh',
    age: '1 h',
    sourceCallId: 'CL-4415',
    status: 'Open',
  },
  {
    id: 'E-308',
    category: 'Repeated broken promise',
    customer: 'Sri Sai Motors',
    severity: 'High',
    owner: 'CM — Ramesh',
    age: '6 h',
    sourceCallId: 'CL-4402',
    status: 'Open',
  },
];

// Alias for TICKETS for backwards compatibility
export const TICKETS: EscalationItem[] = ESCALATIONS;

export const CAMPAIGN_CONTACTS: CampaignContact[] = [
  { id: 'C1', name: 'Sri Balaji Kirana & General Store', phno: '+91 98490 22114', creditPeriod: '30 Days', addedAt: '2026-04-14' },
  { id: 'C2', name: 'Lakshmi Super Bazar', phno: '+91 97001 88342', creditPeriod: '45 Days', addedAt: '2026-04-14' },
  { id: 'C3', name: 'Ganesh Provision Store', phno: '+91 94400 12789', creditPeriod: '15 Days', addedAt: '2026-04-14' },
  { id: 'C4', name: 'Shree Krishna Traders', phno: '+91 98850 66321', creditPeriod: '60 Days', addedAt: '2026-04-14' },
  { id: 'C5', name: 'New Bharat Medical & General', phno: '+91 99123 45670', creditPeriod: '30 Days', addedAt: '2026-04-14' },
  { id: 'C6', name: 'Durga Bhavani Stores', phno: '+91 96521 90812', creditPeriod: '30 Days', addedAt: '2026-04-14' },
  { id: 'C7', name: 'Venkateshwara Super Market', phno: '+91 98491 55432', creditPeriod: '21 Days', addedAt: '2026-04-13' },
  { id: 'C8', name: 'Srinivasa Kirana & Oil', phno: '+91 98493 11223', creditPeriod: '30 Days', addedAt: '2026-04-13' },
  { id: 'C9', name: 'Sai Ram Daily Needs', phno: '+91 97004 99881', creditPeriod: '15 Days', addedAt: '2026-04-12' },
  { id: 'C10', name: 'Manikanta Enterprises', phno: '+91 98490 88776', creditPeriod: '45 Days', addedAt: '2026-04-12' },
  { id: 'C11', name: 'Sai Krupa General Store', phno: '+91 97002 33445', creditPeriod: '30 Days', addedAt: '2026-04-11' },
  { id: 'C12', name: 'Royal Footwear & Stores', phno: '+91 99120 77665', creditPeriod: '60 Days', addedAt: '2026-04-11' }
];

export const AV: Record<string, string> = {
  PA: '#53617C',
  TA: '#1E52C9',
  OW: '#0F2350',
  CM: '#0E8794',
  CE: '#157F4C',
  AC: '#B07C00',
};

export const LANGS = ['Telugu', 'Hindi', 'English', 'Tamil', 'Kannada'];
export const LANG_CODES: Record<string, string> = { te: 'Telugu', hi: 'Hindi', en: 'English', ta: 'Tamil', kn: 'Kannada' };
export const CALL_TYPES = ['Collection', 'Reminder', 'Reorder', 'Follow-up'];

export const RETAILERS: Retailer[] = [
  { id: 'R1', name: 'Sri Balaji Kirana & General Store', code: 'RET-0481', city: 'Saidabad, Hyderabad', owner: 'R. K. Venkatesh', phone: '+91 98490 22114', lang: 'Telugu', bucket: '31–60d', os: 245000, od: 180000, lim: 300000, lastCall: 'Today 10:42 AM', ptp: '2026-04-18 (₹1,00,000)', disp: 'PTP given', score: 88, auto: 'L2', creditPeriod: '30 Days',
    history: [
      { d: 'Today 10:42 AM', typ: 'Collection', dur: '3m 42s', disp: 'PTP given (₹1,00,000 on Apr 18)', rec: 'rec-4416.wav' },
      { d: '2026-04-04', typ: 'Reminder', dur: '1m 18s', disp: 'Call not lifted (attempt 2)', rec: 'rec-4102.wav' },
      { d: '2026-03-28', typ: 'Collection', dur: '4m 05s', disp: 'Dispute raised (short delivery)', rec: 'rec-3891.wav' },
      { d: '2026-03-15', typ: 'Reorder', dur: '2m 50s', disp: 'Order placed (₹42,000)', rec: 'rec-3410.wav' }
    ],
    invoices: [
      { inv: 'INV-2026-0891', amt: 100000, due: '2026-03-15', st: 'Overdue 34d' },
      { inv: 'INV-2026-0944', amt: 80000, due: '2026-03-31', st: 'Overdue 18d' },
      { inv: 'INV-2026-1021', amt: 65000, due: '2026-04-25', st: 'Current' }
    ]
  },
  { id: 'R2', name: 'Lakshmi Super Bazar', code: 'RET-1102', city: 'Malakpet, Hyderabad', owner: 'K. Srinivasa Rao', phone: '+91 97001 88342', lang: 'Telugu', bucket: '61–90d', os: 380000, od: 380000, lim: 400000, lastCall: 'Today 11:15 AM', ptp: 'None', disp: 'Payment dispute', score: 42, auto: 'L1', creditPeriod: '45 Days',
    history: [
      { d: 'Today 11:15 AM', typ: 'Collection', dur: '5m 12s', disp: 'Payment dispute — damaged stock INV-0774', rec: 'rec-4422.wav' }
    ],
    invoices: [
      { inv: 'INV-2026-0774', amt: 210000, due: '2026-02-10', st: 'Overdue 67d' },
      { inv: 'INV-2026-0810', amt: 170000, due: '2026-02-28', st: 'Overdue 49d' }
    ]
  },
  { id: 'R3', name: 'Ganesh Provision Store', code: 'RET-0914', city: 'Dilsukhnagar, Hyderabad', owner: 'M. Ganesh', phone: '+91 94400 12789', lang: 'Telugu', bucket: '1–30d', os: 95000, od: 45000, lim: 200000, lastCall: 'Today 09:30 AM', ptp: '2026-04-15 (₹45,000)', disp: 'PTP given', score: 92, auto: 'L2', creditPeriod: '15 Days',
    history: [{ d: 'Today 09:30 AM', typ: 'Collection', dur: '2m 10s', disp: 'PTP kept previously; new PTP Apr 15', rec: 'rec-4401.wav' }],
    invoices: [{ inv: 'INV-2026-1101', amt: 45000, due: '2026-04-01', st: 'Overdue 17d' }]
  },
  { id: 'R4', name: 'Shree Krishna Traders', code: 'RET-1420', city: 'Secunderabad', owner: 'D. Krishna', phone: '+91 98850 66321', lang: 'Hindi', bucket: '>90d', os: 520000, od: 520000, lim: 500000, lastCall: 'Today 12:05 PM', ptp: 'None', disp: 'Broken promise (2x)', score: 25, auto: 'L0', creditPeriod: '60 Days',
    history: [{ d: 'Today 12:05 PM', typ: 'Collection', dur: '4m 45s', disp: 'Broken promise 2x — field visit recommended', rec: 'rec-4439.wav' }],
    invoices: [{ inv: 'INV-2026-0612', amt: 520000, due: '2026-01-15', st: 'Overdue 93d' }]
  },
  { id: 'R5', name: 'New Bharat Medical & General', code: 'RET-0331', city: 'Koti, Hyderabad', owner: 'A. Bharat', phone: '+91 99123 45670', lang: 'Telugu', bucket: '1–30d', os: 140000, od: 140000, lim: 250000, lastCall: 'Today 10:05 AM', ptp: '2026-04-16 (₹1,40,000)', disp: 'PTP given', score: 85, auto: 'L2', creditPeriod: '30 Days',
    history: [{ d: 'Today 10:05 AM', typ: 'Collection', dur: '3m 02s', disp: 'PTP given for full overdue on Apr 16', rec: 'rec-4409.wav' }],
    invoices: [{ inv: 'INV-2026-1045', amt: 140000, due: '2026-04-02', st: 'Overdue 16d' }]
  },
  { id: 'R6', name: 'Durga Bhavani Stores', code: 'RET-1804', city: 'Charminar, Hyderabad', owner: 'B. Srinivas', phone: '+91 96521 90812', lang: 'Telugu', bucket: '31–60d', os: 185000, od: 185000, lim: 200000, lastCall: 'Today 11:40 AM', ptp: 'None', disp: 'Call not lifted (att 3)', score: 38, auto: 'L1', creditPeriod: '30 Days',
    history: [{ d: 'Today 11:40 AM', typ: 'Collection', dur: '0m 45s', disp: 'No lift attempt 3 — WhatsApp sent', rec: 'rec-4430.wav' }],
    invoices: [{ inv: 'INV-2026-0899', amt: 185000, due: '2026-03-20', st: 'Overdue 29d' }]
  }
];

export const CALLS: CallItem[] = [
  { id: 'CL-4390', ret: 'R10', name: 'Venkateswara Traders', ph: '+91 98490 12001', time: '10:15 AM', lang: 'Telugu', dur: '4m 12s', disp: 'Dispute raised', ptp: 'None', auto: 'L1', audio: 'rec-4390.wav', score: 40, batchId: 'BATCH-2026-04-14-A',
    turns: [
      { who: 'RIA', lang: 'te', txt: 'నమస్కారం, రాక్సీ డిస్ట్రిబ్యూటర్స్ నుంచి ఆర్ఐఏ మాట్లాడుతున్నాను.' },
      { who: 'Retailer', lang: 'te', txt: 'లాస్ట్ ఆర్డర్‌లో 5 బాక్సులు మిస్సింగ్ అయ్యాయి, అకౌంట్ క్లియర్ చేసేవరకు పేమెంట్ చేయలేను.' }
    ]
  },
  { id: 'CL-4414', ret: 'R11', name: 'RK Motors', ph: '+91 97001 33221', time: '10:35 AM', lang: 'Telugu', dur: '2m 50s', disp: 'Already-paid claim', ptp: 'None', auto: 'L2', audio: 'rec-4414.wav', score: 75, batchId: 'BATCH-2026-04-14-A',
    turns: [
      { who: 'RIA', lang: 'te', txt: 'నమస్కారం, బకాయి ₹65,000 గురించి మాట్లాడుతున్నాను.' },
      { who: 'Retailer', lang: 'te', txt: 'నిన్ననే నెఫ్ట్ (NEFT) ద్వారా ప్రియ గారికి పంపించాను, లెడ్జర్ చెక్ చేయండి.' }
    ]
  },
  { id: 'CL-4415', ret: 'R12', name: 'MAK Spares', ph: '+91 94400 99881', time: '10:40 AM', lang: 'Hindi', dur: '1m 45s', disp: 'Low model confidence', ptp: 'None', auto: 'L1', audio: 'rec-4415.wav', score: 35, batchId: 'BATCH-2026-04-14-A',
    turns: [
      { who: 'RIA', lang: 'hi', txt: 'नमस्ते, रॉक्सी डिस्ट्रीब्यूटर्स से आरआईए।' },
      { who: 'Retailer', lang: 'hi', txt: 'आवाज़ साफ़ नहीं आ रही, रमेश जी को बोलो मुझसे बात करें।' }
    ]
  },
  { id: 'CL-4402', ret: 'R13', name: 'Sri Sai Motors', ph: '+91 98850 77112', time: '10:50 AM', lang: 'Telugu', dur: '3m 15s', disp: 'Repeated broken promise', ptp: 'None', auto: 'L0', audio: 'rec-4402.wav', score: 20, batchId: 'BATCH-2026-04-14-A',
    turns: [
      { who: 'RIA', lang: 'te', txt: 'నమస్కారం సాయి మోటార్స్, గత 2 పీటీపీలు విఫలమయ్యాయి.' },
      { who: 'Retailer', lang: 'te', txt: 'ఈసారి ఖచ్చితంగా ఇస్తాను అన్నాను కదా, మళ్ళీ ఎందుకు కాల్ చేశారు?' }
    ]
  },
  { id: 'CL-4416', ret: 'R1', name: 'Sri Balaji Kirana & General Store', ph: '+91 98490 22114', time: '10:42 AM', lang: 'Telugu', dur: '3m 42s', disp: 'PTP given', ptp: '2026-04-18', auto: 'L2', audio: 'rec-4416.wav', score: 88, batchId: 'BATCH-2026-04-14-A',
    turns: [
      { who: 'RIA', lang: 'te', txt: 'నమస్కారం వెంకటేశ్ గారూ! నేను రాక్సీ డిస్ట్రిబ్యూటర్స్ నుంచి ఆర్ఐఏ (RIA) ని మాట్లాడుతున్నాను. బాగున్నారా?' },
      { who: 'Retailer', lang: 'te', txt: 'నమస్తే అండీ. బాగున్నాను. చెప్పండి.' },
      { who: 'RIA', lang: 'te', txt: 'వెంకటేశ్ గారూ, మీ ఖాతాలో ₹1,80,000 బాకీ ఉంది. ఇన్వాయిస్ 0891 మరియు 0944 గత నెల 15 మరియు 31 నాటివి. వీటి చెల్లింపు ఎప్పుడు చేయగలరు?' },
      { who: 'Retailer', lang: 'te', txt: 'ఈ వారం కొద్దిగా కలెక్షన్స్ నెమ్మదిగా ఉన్నాయి. శనివారం (ఏప్రిల్ 18) ఒక లక్ష రూపాయలు ఆర్టీజీఎస్ (RTGS) చేస్తాను. మిగిలిన ₹80,000 వచ్చే వారం క్లియర్ చేస్తాను.' },
      { who: 'RIA', lang: 'te', txt: 'ధన్యవాదాలు వెంకటేశ్ గారూ. శనివారం ఏప్రిల్ 18 న ₹1,00,000 చెల్లింపు నమోదు చేసుకున్నాను. చెల్లింపు లింక్ మీ వాట్సాప్ కి పంపించమంటారా?' },
      { who: 'Retailer', lang: 'te', txt: 'అవును, వాట్సాప్ చేయండి, నేను చూసుకుంటాను.' },
      { who: 'RIA', lang: 'te', txt: 'ఖచ్చితంగా పంపుతున్నాను. మీ సహకారానికి ధన్యవాదాలు. రోక్సీతో మీ వ్యాపారం శుభప్రదం కావాలని కోరుకుంటున్నాము. నమస్కారం!' }
    ]
  }
];

export const CALL_BATCHES: CallBatch[] = [
  {
    id: 'BATCH-2026-04-14-A',
    name: 'Daily Morning Collection Run (Hyderabad Central)',
    createdAt: 'Today 08:30 AM',
    importedBy: 'Vishal T.',
    fileName: 'calls_2026_04_14.csv',
    totalCalls: 240,
    completedCalls: 238,
    connectedCalls: 205,
    ptpCount: 142,
    ptpAmount: 1850000,
    disputeCount: 18,
    noLiftCount: 38,
    status: 'Completed',
    calls: CALLS,
  },
  {
    id: 'BATCH-2026-04-13-A',
    name: 'Overdue >60d Evening Follow-up',
    createdAt: '2026-04-13 04:00 PM',
    importedBy: 'Vishal T.',
    fileName: 'calls_2026_04_13.csv',
    totalCalls: 225,
    completedCalls: 225,
    connectedCalls: 190,
    ptpCount: 128,
    ptpAmount: 1620000,
    disputeCount: 12,
    noLiftCount: 32,
    status: 'Completed',
    calls: CALLS.slice(0, 3),
  },
  {
    id: 'BATCH-2026-04-12-B',
    name: 'Secunderabad & Saidabad Priority Run',
    createdAt: '2026-04-12 11:15 AM',
    importedBy: 'Suresh Raina',
    fileName: 'calls_2026_04_12.csv',
    totalCalls: 210,
    completedCalls: 210,
    connectedCalls: 178,
    ptpCount: 112,
    ptpAmount: 1480000,
    disputeCount: 15,
    noLiftCount: 28,
    status: 'Completed',
    calls: CALLS.slice(1, 4),
  },
  {
    id: 'BATCH-2026-04-11-A',
    name: 'Weekend Morning Reorder & Reminder Batch',
    createdAt: '2026-04-11 09:00 AM',
    importedBy: 'Vishal T.',
    fileName: 'calls_2026_04_11.csv',
    totalCalls: 195,
    completedCalls: 195,
    connectedCalls: 165,
    ptpCount: 101,
    ptpAmount: 1240000,
    disputeCount: 9,
    noLiftCount: 25,
    status: 'Completed',
    calls: CALLS.slice(2, 5),
  },
];

export const SCHEDULED_CALLBACKS: ScheduledCallbackItem[] = [
  {
    id: 'SCH-101',
    ret: 'R1',
    name: 'Sri Balaji Kirana & General Store',
    ph: '+91 98490 22114',
    outstanding: 180000,
    type: 'customer_requested',
    priority: 'High',
    scheduledTime: 'Today, 04:30 PM',
    relativeDue: 'In 24 mins',
    isDueNow: true,
    attempt: 1,
    maxAttempts: 3,
    aiNote: 'Retailer was attending store customers. Stated: "Call after 4 PM, I will arrange RTGS."',
    status: 'Queued',
    sourceCallId: 'CL-4416',
    lastOutcome: 'Customer requested 4:30 PM callback',
  },
  {
    id: 'SCH-102',
    ret: 'R2',
    name: 'Lakshmi Super Bazar',
    ph: '+91 97001 88342',
    outstanding: 380000,
    type: 'no_lift_retry',
    priority: 'High',
    scheduledTime: 'Today, 10:20 AM',
    relativeDue: 'In 5 mins',
    isDueNow: true,
    attempt: 2,
    maxAttempts: 3,
    aiNote: 'Ringing No Answer at 10:15 AM. Autonomous quick-retry scheduled in 5 mins.',
    status: 'Queued',
    sourceCallId: 'CL-4417',
    lastOutcome: 'No Lift (Attempt #1)',
  },
  {
    id: 'SCH-103',
    ret: 'R4',
    name: 'Shree Krishna Traders',
    ph: '+91 98850 66321',
    outstanding: 520000,
    type: 'customer_requested',
    priority: 'High',
    scheduledTime: 'Today, 05:15 PM',
    relativeDue: 'In 2 hrs',
    isDueNow: false,
    attempt: 1,
    maxAttempts: 3,
    aiNote: 'Spoke with cashier. Owner Ramesh Ji in bank, asked RIA to call after 5 PM.',
    status: 'Queued',
    sourceCallId: 'CL-4419',
    lastOutcome: 'Owner unavailable, callback requested',
  },
  {
    id: 'SCH-104',
    ret: 'R6',
    name: 'Durga Bhavani Stores',
    ph: '+91 96521 90812',
    outstanding: 185000,
    type: 'no_lift_retry',
    priority: 'Medium',
    scheduledTime: 'Today, 11:25 AM',
    relativeDue: 'In 5 mins',
    isDueNow: true,
    attempt: 1,
    maxAttempts: 3,
    aiNote: 'Line busy / Not answered at 11:20 AM. Autonomous fast-retry scheduled in 5 mins.',
    status: 'Queued',
    sourceCallId: 'CL-4421',
    lastOutcome: 'Line Busy (Attempt #1)',
  },
  {
    id: 'SCH-105',
    ret: 'R8',
    name: 'Balaji Agencies & Stores',
    ph: '+91 98490 88219',
    outstanding: 90000,
    type: 'customer_requested',
    priority: 'Medium',
    scheduledTime: 'Tomorrow, 10:00 AM',
    relativeDue: 'Tomorrow morning',
    isDueNow: false,
    attempt: 1,
    maxAttempts: 3,
    aiNote: 'Retailer requested morning call after opening cash counter: "Repu 10 ki cheyandi."',
    status: 'Queued',
    sourceCallId: 'CL-4423',
    lastOutcome: 'Callback scheduled for next day',
  },
  {
    id: 'SCH-106',
    ret: 'R13',
    name: 'Sri Sai Motors',
    ph: '+91 98850 77112',
    outstanding: 310000,
    type: 'no_lift_retry',
    priority: 'High',
    scheduledTime: 'Exhausted',
    relativeDue: '3/3 Failed',
    isDueNow: false,
    attempt: 3,
    maxAttempts: 3,
    aiNote: '3 consecutive attempts (Morning, Afternoon, Evening) went unanswered. Recommending physical field visit.',
    status: 'Exhausted',
    sourceCallId: 'CL-4402',
    lastOutcome: 'Max retries exceeded (3 attempts)',
  },
];

export const USERS: UserItem[] = [
  { id: 'U1', n: 'Vishal T. (You)', e: 'vishal@roxyindustries.in', role: 'OW', ph: '+91 98490 10001', st: 'Active' },
  { id: 'U2', n: 'Suresh Raina', e: 'suresh.r@roxyindustries.in', role: 'CM', ph: '+91 98490 10002', st: 'Active' },
  { id: 'U3', n: 'Pooja Hegde', e: 'pooja.h@roxyindustries.in', role: 'CE', ph: '+91 98490 10003', st: 'Active' },
  { id: 'U4', n: 'Ramesh Kumar', e: 'ramesh.k@roxyindustries.in', role: 'AC', ph: '+91 98490 10004', st: 'Active' },
  { id: 'U5', n: 'K. S. Rao & Co.', e: 'audit@ksraoco.in', role: 'PA', ph: '+91 98490 10005', st: 'Active' },
  { id: 'U6', n: 'Admin Team', e: 'admin@roxyindustries.in', role: 'TA', ph: '+91 98490 10006', st: 'Active' }
];

export const TREND: TrendItem[] = [
  { d: 'Mon', placed: 180, conn: 152, ptp: 94 },
  { d: 'Tue', placed: 210, conn: 178, ptp: 112 },
  { d: 'Wed', placed: 195, conn: 165, ptp: 101 },
  { d: 'Thu', placed: 225, conn: 190, ptp: 128 },
  { d: 'Fri', placed: 240, conn: 205, ptp: 142 },
  { d: 'Sat', placed: 160, conn: 138, ptp: 88 },
  { d: 'Sun', placed: 40, conn: 32, ptp: 18 }
];

export const RECOVERY: RecoveryItem[] = [
  { d: 'Wk 11', dem: 4200000, rec: 3100000 },
  { d: 'Wk 12', dem: 4800000, rec: 3650000 },
  { d: 'Wk 13', dem: 5100000, rec: 3900000 },
  { d: 'Wk 14', dem: 4600000, rec: 3800000 },
  { d: 'Wk 15 (curr)', dem: 5400000, rec: 4120000 }
];

export const RESP: ResponseStat[] = [
  { k: 'ptp', l: 'PTP given', n: 142, c: 'var(--green)', d: 'Retailer committed to a specific date & amount' },
  { k: 'dispute', l: 'Payment dispute', n: 18, c: 'var(--red)', d: 'Claims damaged goods, rate difference or short delivery' },
  { k: 'already_paid', l: 'Already paid', n: 24, c: 'var(--blue)', d: 'Claims payment done via cash/cheque/UPI' },
  { k: 'nolift', l: 'Call not lifted', n: 38, c: 'var(--gold)', d: 'Ringing, busy or switched off across attempts' },
  { k: 'wrong_number', l: 'Wrong / dead number', n: 6, c: '#8593AD', d: 'Number invalid, not reachable or wrong person' },
  { k: 'human_escalate', l: 'Asked for person', n: 11, c: 'var(--teal)', d: 'Explicitly asked to talk to credit manager/salesman' },
  { k: 'broken_ptp', l: 'Broken PTP', n: 14, c: 'var(--red)', d: 'Missed committed date without payment' }
];

export const RESP_BY = Object.fromEntries(RESP.map((r) => [r.k, r]));
export const RESP_TOTAL = RESP.reduce((a, r) => a + r.n, 0);

export const PTP_ST: Record<string, [string, string]> = {
  due: ['Due today', 'c-gold'],
  upcoming: ['Upcoming', 'c-blue'],
  kept: ['Kept', 'c-green'],
  broken: ['Broken', 'c-red']
};

export const PTPS: PtpItem[] = [
  { id: 'PTP-101', ret: 'R1', name: 'Sri Balaji Kirana & General Store', due: '2026-04-18', amt: 100000, st: 'upcoming', auto: 'L2', ph: '+91 98490 22114' },
  { id: 'PTP-102', ret: 'R3', name: 'Ganesh Provision Store', due: '2026-04-15', amt: 45000, st: 'due', auto: 'L2', ph: '+91 94400 12789' },
  { id: 'PTP-103', ret: 'R5', name: 'New Bharat Medical & General', due: '2026-04-16', amt: 140000, st: 'upcoming', auto: 'L2', ph: '+91 99123 45670' },
  { id: 'PTP-104', ret: 'R4', name: 'Shree Krishna Traders', due: '2026-04-08', amt: 250000, st: 'broken', auto: 'L0', ph: '+91 98850 66321' },
  { id: 'PTP-105', ret: 'R7', name: 'Venkateshwara Super Market', due: '2026-04-12', amt: 75000, st: 'kept', auto: 'L2', ph: '+91 98491 55432' }
];

export const NOLIFT: NoLiftItem[] = [
  { ret: 'R6', name: 'Durga Bhavani Stores', att: 3, last: 'Today 11:40 AM', next: 'In 5 mins', auto: 'L1', ph: '+91 96521 90812' },
  { ret: 'R8', name: 'Srinivasa Kirana & Oil', att: 2, last: 'Today 10:20 AM', next: 'In 5 mins', auto: 'L2', ph: '+91 98493 11223' },
  { ret: 'R9', name: 'Sai Ram Daily Needs', att: 1, last: 'Today 09:15 AM', next: 'In 5 mins', auto: 'L2', ph: '+91 97004 99881' }
];

export const OTHER_RESP: OtherResponseItem[] = [
  { ret: 'R2', name: 'Lakshmi Super Bazar', disp: 'Payment dispute', det: 'Damaged stock in INV-0774 (₹2,10,000). Ticket #TK-1082 created.', auto: 'L1', c: 'var(--red)' },
  { ret: 'R4', name: 'Shree Krishna Traders', disp: 'Broken promise (2x)', det: 'Failed on Apr 02 and Apr 08. Field visit advised.', auto: 'L0', c: 'var(--red)' },
  { ret: 'R10', name: 'Manikanta Enterprises', disp: 'Already paid', det: 'Claims RTGS done on Apr 10. UTR needed for ledger check.', auto: 'L2', c: 'var(--blue)' },
  { ret: 'R11', name: 'Sai Krupa General Store', disp: 'Asked for person', det: 'Wants to negotiate 5% discount with credit manager.', auto: 'L1', c: 'var(--teal)' },
  { ret: 'R12', name: 'Royal Footwear & Stores', disp: 'Wrong number', det: 'Owner changed mobile. Salesman updated phone requested.', auto: 'L2', c: '#8593AD' }
];

export const ALL_RESP = [
  ...PTPS.map((p) => ({ ret: p.ret, name: p.name, ph: p.ph, disp: 'PTP — ' + inrFormatted(p.amt) + ' on ' + p.due, st: PTP_ST[p.st][0], sc: PTP_ST[p.st][1], auto: p.auto })),
  ...NOLIFT.map((n) => ({ ret: n.ret, name: n.name, ph: n.ph, disp: 'Call not lifted (' + n.att + ' attempts)', st: 'Retry ' + n.next, sc: 'c-gold', auto: n.auto })),
  ...OTHER_RESP.map((o) => ({ ret: o.ret, name: o.name, ph: '—', disp: o.disp + ' — ' + o.det, st: o.disp, sc: o.disp.includes('dispute') || o.disp.includes('Broken') ? 'c-red' : 'c-blue', auto: o.auto }))
];

function inrFormatted(n: number): string {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export const CARE: CustomerCareContact[] = [
  { n: 'Credit Helpdesk (Direct)', r: 'Escalations & Disputes', p: '+91 40 2450 1100', e: 'credit@roxyindustries.in', h: '9:30 AM – 6:30 PM (Mon–Sat)' },
  { n: 'Suresh Raina', r: 'Credit Manager', p: '+91 98490 10002', e: 'suresh.r@roxyindustries.in', h: 'Direct review & approvals' },
  { n: 'WhatsApp Support', r: 'Automated + Human Assist', p: '+91 98490 10099', e: '—', h: '24x7 bot + 9 AM–7 PM human' },
  { n: 'Accountant (Ledger)', r: 'Payments & UTR reconciliation', p: '+91 40 2450 1104', e: 'accounts@roxyindustries.in', h: '10:00 AM – 6:00 PM' }
];

export const IMPORT_HISTORY: ImportHistoryItem[] = [
  { d: 'Today 08:30 AM', rows: 240, rej: 2, fn: 'calls_2026_04_14.csv', by: 'Vishal T.' },
  { d: '2026-04-13', rows: 225, rej: 0, fn: 'calls_2026_04_13.csv', by: 'Vishal T.' },
  { d: '2026-04-12', rows: 210, rej: 5, fn: 'calls_2026_04_12.csv', by: 'Suresh Raina' },
  { d: '2026-04-11', rows: 195, rej: 1, fn: 'calls_2026_04_11.csv', by: 'Vishal T.' }
];

export const PROVIDERS: VoiceProvider[] = [
  { k: 'bolna', n: 'Bolna AI', d: 'Enterprise Indian telephony, deep vernacular models, sub-450ms turnaround.', cost: '₹1.10 / min', lat: '380 ms', creds: ['bolna_api_key', 'bolna_agent_id'] },
  { k: 'sarvam', n: 'Sarvam AI', d: 'High naturalness Telugu, Hindi, Tamil & Kannada TTS + ASR pipelines.', cost: '₹0.95 / min', lat: '420 ms', creds: ['sarvam_api_key', 'sarvam_voice_id'] },
  { k: 'exotel', n: 'Exotel + LiveKit', d: 'Carrier-grade SIP trunking across India, local DID management.', cost: '₹0.75 / min + ₹0.40 AI', lat: '490 ms', creds: ['exotel_sid', 'exotel_token', 'exotel_subdomain'] },
  { k: 'twilio', n: 'Twilio Voice', d: 'Global standard telephony with webhook-based media streams.', cost: '₹1.45 / min', lat: '520 ms', creds: ['twilio_sid', 'twilio_auth_token'] }
];

export const VOICES = ['Female · warm', 'Female · neutral', 'Male · neutral', 'Male · formal'];

export const CFG: AppConfig = {
  provider: 'bolna',
  creds: {
    bolna: { bolna_api_key: '••••••••••••••••3a9f', bolna_agent_id: 'agt_telugu_v2_roxy' },
    sarvam: { sarvam_api_key: '••••••••••••••••7c11', sarvam_voice_id: 'sarvam_te_female_1' },
    exotel: { exotel_sid: 'roxyind1', exotel_token: '••••••••••••••••88bb', exotel_subdomain: 'api.exotel.com' },
    twilio: { twilio_sid: 'AC••••••••••••••••', twilio_auth_token: '••••••••••••••••' }
  },
  numbers: [
    { num: '+91 40 6822 4401', lbl: 'Hyderabad Primary (Outbound)', pri: true, on: true },
    { num: '+91 40 6822 4402', lbl: 'Hyderabad Secondary (Overflow)', pri: false, on: true },
    { num: '+91 80 4719 3301', lbl: 'Bengaluru Trunk (Karnataka)', pri: false, on: false }
  ],
  voice: {
    voice: 'Female · warm',
    speed: 1.0,
    pitch: 0.0,
    punct: true,
    noise: true,
    lang: 'Telugu'
  },
  rules: {
    cap: 3,
    starthour: '09:00',
    endhour: '18:30',
    cooldown: 4,
    ptpwindow: 7,
    escalate: 2,
    blockdispute: true,
    blockholiday: true
  },
  general: {
    tenant: 'Roxy Distributors LLP',
    gstin: '36AABCR1234F1Z8',
    callerid: 'ROXY-HYD',
    audiodays: 90,
    auditdays: 365,
    webhook: 'https://api.roxyindustries.in/ria/webhook',
    escalateemail: 'credit@roxyindustries.in',
    escalatesms: '+91 98490 10002'
  }
};

export const REPORTS: ReportItem[] = [
  { k: 'daily_summary', n: 'Daily Collection Summary', d: 'All calls, dispositions, PTPs committed and recovery totals for today.', fmt: 'CSV', fn: 'ria_daily_summary_2026_04_14.csv' },
  { k: 'ptp_pipeline', n: 'Active PTP Pipeline', d: 'Every promise to pay due in the next 14 days with retailer phone numbers.', fmt: 'CSV', fn: 'ria_ptp_pipeline.csv' },
  { k: 'disputes', n: 'Open Disputes & Claims', d: 'All retailers who disputed invoices, reasons given and assigned tickets.', fmt: 'CSV', fn: 'ria_disputes_active.csv' },
  { k: 'no_lift', n: 'No-Lift & Retry Queue', d: 'Retailers not reached after 2+ attempts for field executive follow-up.', fmt: 'CSV', fn: 'ria_nolift_queue.csv' },
  { k: 'audit_log', n: 'Audit Trail (30 days)', d: 'Immutable log of human approvals, config changes and rule overrides.', fmt: 'CSV', fn: 'ria_audit_log_30d.csv' }
];

export const GREET: Record<string, [string, string]> = {
  Telugu: ['te-IN', 'నమస్కారం, నేను రాక్సీ డిస్ట్రిబ్యూటర్స్ నుంచి ఆర్ఐఏ (RIA) ని మాట్లాడుతున్నాను. మీ బకాయి వివరాలు తెలపడానికి కాల్ చేశాను.'],
  Hindi: ['hi-IN', 'नमस्ते, मैं रॉक्सी डिस्ट्रीब्यूटर्स से आरआईए (RIA) बात कर रही हूँ। आपके बकाया भुगतान के सम्बंध में यह कॉल है।'],
  English: ['en-IN', 'Hello! This is RIA from Roxy Distributors calling regarding your outstanding invoices.'],
  Tamil: ['ta-IN', 'வணக்கம், நான் ராக்ஸி டிஸ்ட்ரிபியூட்டர்ஸிலிருந்து ஆர்ఐఏ (RIA) பேசுகிறேன்.'],
  Kannada: ['kn-IN', 'ನಮಸ್ಕಾರ, ನಾನು ರಾಕ್ಸಿ ಡಿಸ್ಟ್ರಿಬ್ಯೂಟರ್ಸ್ ಇಂದ ಆರ್ఐಎ (RIA) ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ.']
};

export const CSV_ALIASES: Record<string, string[]> = {
  name: ['name', 'customer_name', 'contact_name', 'person', 'retailer_name'],
  phno: ['phno', 'phone', 'mobile', 'ph', 'contact', 'tel', 'phone_number'],
  business: ['business', 'store_name', 'retailer_name', 'company', 'shop_name', 'store', 'firm'],
  amount: ['amount', 'os', 'total_amount', 'total_due', 'balance', 'total_os', 'order_amount'],
  due_amount: ['due_amount', 'due amount', 'dueamt', 'od', 'overdue', 'past_due', 'od_amount', 'pending_amount'],
  due_date: ['due_date', 'due date', 'duedate', 'ptp_date', 'target_date', 'date'],
  credit_period: ['credit_period', 'credit period', 'creditperiod', 'terms', 'payment_terms', 'credit_days', 'days'],
  lang: ['lang', 'language', 'preferred_lang', 'vernacular'],
  code: ['code', 'retailer_code', 'cust_code', 'id'],
  city: ['city', 'location', 'area', 'town'],
  bucket: ['bucket', 'aging', 'ageing', 'days_past_due', 'dpd'],
};

export const EMPTIES: Record<string, [string, string, string]> = {
  dashboard: ['📊', 'No calls or recovery data today', 'Import the daily call list from the Calls tab to begin the run.'],
  collections: ['₹', 'No active promises or responses', 'Once calls are placed, promises and outcomes will populate here in real time.'],
  calls: ['☏', 'No calls in the queue', 'Drop a CSV call sheet above or click Load Sample Batch to run modelled calls.'],
  calldetail: ['🔍', 'No call selected', 'Pick a call from the Collections or Calls tab to view its transcript and outcome.'],
  retailers: ['🏪', 'No retailer selected', 'Pick a retailer from the table to see 360° account details and invoice ledger.'],
  tickets: ['⚑', 'No open escalations', 'Disputes, broken promises, and human escalations will surface here automatically.'],
  escalations: ['⚑', 'No open escalations', 'Disputes, broken promises, and human escalations will surface here automatically.'],
  contacts: ['📇', 'No contacts added to campaigns yet', 'Upload a campaign call sheet or click Add Contact to register new customers.']
};
