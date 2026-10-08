'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  RoleKey,
  ViewState,
  ScreenKey,
  PermissionLevel,
  Retailer,
  CallItem,
  CallBatch,
  ScheduledCallbackItem,
  EscalationItem,
  CustomerCareContact,
  UserItem,
  AppConfig,
  CampaignContact,
} from '@/types';
import {
  ROLES,
  PERM,
  RETAILERS,
  CALLS,
  CALL_BATCHES,
  SCHEDULED_CALLBACKS,
  ESCALATIONS,
  CARE,
  USERS,
  CFG,
  CAMPAIGN_CONTACTS,
} from '@/data/mockData';

interface ModalState {
  isOpen: boolean;
  title: string;
  body: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

interface AppContextType {
  role: RoleKey;
  setRole: (r: RoleKey) => void;
  viewState: ViewState;
  setViewState: (v: ViewState) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (l: boolean) => void;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  selectedRetailerId: string;
  setSelectedRetailerId: (id: string) => void;
  selectedCallId: string;
  setSelectedCallId: (id: string) => void;
  collectionsTab: string;
  setCollectionsTab: (t: string) => void;
  escalations: EscalationItem[];
  addEscalation: (e: Omit<EscalationItem, 'id' | 'age'>) => void;
  assignEscalation: (id: string, owner: string) => void;
  resolveEscalation: (id: string, note?: string) => void;
  // Ticket aliases
  tickets: EscalationItem[];
  addTicket: (t: any) => void;
  updateTicket: (id: string, updates: Partial<EscalationItem>) => void;
  careContacts: CustomerCareContact[];
  addContact: (c: CustomerCareContact) => void;
  campaignContacts: CampaignContact[];
  addCampaignContact: (c: Omit<CampaignContact, 'id'>) => void;
  users: UserItem[];
  updateUser: (id: string, updates: Partial<UserItem>) => void;
  config: AppConfig;
  updateConfig: (updater: (prev: AppConfig) => AppConfig) => void;
  batches: CallBatch[];
  addBatch: (b: CallBatch) => void;
  selectedBatchId: string | null;
  setSelectedBatchId: (id: string | null) => void;
  downloadBatchReport: (b: CallBatch) => void;
  scheduledCallbacks: ScheduledCallbackItem[];
  rescheduleCall: (id: string, newTime: string, note?: string) => void;
  triggerImmediateDial: (id: string) => void;
  cancelScheduledCall: (id: string, reason?: string) => void;
  addScheduledCallback: (item: Omit<ScheduledCallbackItem, 'id'>) => void;
  retailers: Retailer[];
  calls: CallItem[];
  addCalls: (newCalls: CallItem[], newContacts?: Omit<CampaignContact, 'id'>[]) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  modal: ModalState;
  openModal: (title: string, body: ReactNode, footer?: ReactNode, wide?: boolean) => void;
  closeModal: () => void;
  canAct: (scr: ScreenKey) => boolean;
  perm: (scr: ScreenKey, r?: RoleKey) => PermissionLevel;
  me: () => string;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<RoleKey>('OW');
  const [viewState, setViewState] = useState<ViewState>('normal');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [selectedRetailerId, setSelectedRetailerId] = useState<string>('R1');
  const [selectedCallId, setSelectedCallId] = useState<string>('CL-4416');
  const [collectionsTab, setCollectionsTab] = useState<string>('today');
  const [escalations, setEscalations] = useState<EscalationItem[]>(ESCALATIONS);
  const [careContacts, setCareContacts] = useState<CustomerCareContact[]>(CARE);
  const [campaignContacts, setCampaignContacts] = useState<CampaignContact[]>(CAMPAIGN_CONTACTS);
  const [batches, setBatches] = useState<CallBatch[]>(CALL_BATCHES);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [scheduledCallbacks, setScheduledCallbacks] = useState<ScheduledCallbackItem[]>(SCHEDULED_CALLBACKS);
  const [users, setUsers] = useState<UserItem[]>(USERS);
  const [config, setConfig] = useState<AppConfig>(CFG);
  const [retailers] = useState<Retailer[]>(RETAILERS);
  const [calls, setCalls] = useState<CallItem[]>(CALLS);
  const [toast, setToast] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ isOpen: false, title: '', body: null });

  const setRole = (r: RoleKey) => {
    setRoleState(r);
    showToast(`Signed in as ${ROLES[r].n}`);
  };

  const showToast = (msg: string) => {
    setToast(msg);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3200);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const login = (user: string, pass: string): boolean => {
    if (user && pass) {
      setIsLoggedIn(true);
      showToast('Signed in successfully');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const openModal = (title: string, body: ReactNode, footer?: ReactNode, wide = false) => {
    setModal({ isOpen: true, title, body, footer, wide });
  };

  const closeModal = () => {
    setModal({ isOpen: false, title: '', body: null });
  };

  const addEscalation = (e: Omit<EscalationItem, 'id' | 'age'>) => {
    const newId = 'E-' + (312 + escalations.length);
    const newEsc: EscalationItem = {
      ...e,
      id: newId,
      age: 'Just now',
    };
    setEscalations((prev) => [newEsc, ...prev]);
    showToast(`Escalation ${newId} logged`);
  };

  const assignEscalation = (id: string, owner: string) => {
    setEscalations((prev) =>
      prev.map((e) => (e.id === id ? { ...e, owner } : e))
    );
    showToast(`${id} assigned to ${owner}`);
  };

  const resolveEscalation = (id: string, note?: string) => {
    setEscalations((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: 'Resolved', resolutionNote: note || 'Resolved by reviewer' } : e
      )
    );
    showToast(`✓ Escalation ${id} resolved`);
  };

  const addTicket = (t: any) => {
    addEscalation({
      category: t.cat || 'Dispute raised',
      customer: t.cust || 'Retailer Account',
      severity: 'High',
      owner: t.who || 'Unassigned',
      sourceCallId: t.src || 'CL-4416',
      status: 'Open',
    });
  };

  const updateTicket = (id: string, updates: Partial<EscalationItem>) => {
    setEscalations((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    showToast(`Updated ${id}`);
  };

  const addContact = (c: CustomerCareContact) => {
    setCareContacts((prev) => [...prev, c]);
    showToast(`Contact ${c.n} added`);
  };

  const addCampaignContact = (c: Omit<CampaignContact, 'id'>) => {
    const newId = 'C' + (campaignContacts.length + 1);
    const newContact: CampaignContact = {
      ...c,
      id: newId,
      addedAt: new Date().toISOString().slice(0, 10),
    };
    setCampaignContacts((prev) => [newContact, ...prev]);
    showToast(`Contact ${c.name} added to campaign list`);
  };

  const updateUser = (id: string, updates: Partial<UserItem>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    showToast(`User updated`);
  };

  const updateConfig = (updater: (prev: AppConfig) => AppConfig) => {
    setConfig((prev) => updater(prev));
  };

  const addBatch = (b: CallBatch) => {
    setBatches((prev) => [b, ...prev]);
    showToast(`Batch ${b.id} scheduled with ${b.totalCalls} accounts`);
  };

  const downloadBatchReport = (b: CallBatch) => {
    const batchCalls = b.calls && b.calls.length > 0 ? b.calls : calls;
    const rows = [
      ['Batch ID', 'Batch Name', 'Created At', 'Imported By', 'Source File'],
      [b.id, b.name, b.createdAt, b.importedBy, b.fileName],
      [],
      ['Total Calls', 'Connected', 'PTPs Committed', 'PTP Amount (INR)', 'Disputes', 'Not Lifted'],
      [b.totalCalls, b.connectedCalls, b.ptpCount, b.ptpAmount, b.disputeCount, b.noLiftCount],
      [],
      ['Call ID', 'Customer Name', 'Phone Number', 'Time', 'Language', 'Duration', 'Disposition', 'PTP Commitment'],
      ...batchCalls.map((c) => [
        c.id,
        c.name,
        c.ph,
        c.time,
        c.lang,
        c.dur,
        c.disp,
        c.ptp,
      ]),
    ];

    const fn = `batch_report_${b.id.toLowerCase().replace(/[^a-z0-9_]/g, '_')}.csv`;
    const url = URL.createObjectURL(
      new Blob(
        [
          '\ufeff' +
            rows
              .map((r) =>
                r
                  .map((v) => {
                    const s = String(v == null ? '' : v);
                    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
                  })
                  .join(',')
              )
              .join('\r\n'),
        ],
        { type: 'text/csv;charset=utf-8' }
      )
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = fn;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Downloaded ${fn}`);
  };

  const rescheduleCall = (id: string, newTime: string, note?: string) => {
    setScheduledCallbacks((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              scheduledTime: newTime,
              relativeDue: 'Updated schedule',
              isDueNow: false,
              aiNote: note ? `${note} (Rescheduled)` : c.aiNote,
              status: 'Queued',
            }
          : c
      )
    );
    showToast(`✓ Call ${id} rescheduled to ${newTime}`);
  };

  const triggerImmediateDial = (id: string) => {
    const item = scheduledCallbacks.find((c) => c.id === id);
    if (!item) return;

    setScheduledCallbacks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Dialing', relativeDue: 'Dialing now...' } : c))
    );
    showToast(`📞 Autonomous Dialer initiating outbound call to ${item.name} (${item.ph})...`);

    // Simulate completion after 3.5 seconds
    setTimeout(() => {
      setScheduledCallbacks((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: 'Completed', relativeDue: 'Completed just now' } : c
        )
      );
      showToast(`✓ Completed call for ${item.name}. Audio & transcript updated.`);
    }, 3500);
  };

  const cancelScheduledCall = (id: string, reason = 'Cancelled by user') => {
    setScheduledCallbacks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Cancelled', relativeDue: reason } : c))
    );
    showToast(`Cancelled scheduled call ${id}`);
  };

  const addScheduledCallback = (item: Omit<ScheduledCallbackItem, 'id'>) => {
    const newId = `SCH-${100 + scheduledCallbacks.length + 1}`;
    const newItem: ScheduledCallbackItem = {
      ...item,
      id: newId,
    };
    setScheduledCallbacks((prev) => [newItem, ...prev]);
    showToast(`Added ${item.name} to callback queue (${newId})`);
  };

  const addCalls = (newCalls: CallItem[], newContacts?: Omit<CampaignContact, 'id'>[]) => {
    setCalls((prev) => [...newCalls, ...prev]);

    if (newContacts && newContacts.length > 0) {
      setCampaignContacts((prev) => {
        const existingPhones = new Set(prev.map((c) => c.phno.replace(/[^0-9]/g, '')));
        const toAdd: CampaignContact[] = [];
        newContacts.forEach((nc) => {
          const rawPh = nc.phno.replace(/[^0-9]/g, '');
          if (!existingPhones.has(rawPh)) {
            existingPhones.add(rawPh);
            toAdd.push({
              id: 'C' + (prev.length + toAdd.length + 1),
              name: nc.name,
              phno: nc.phno,
              creditPeriod: nc.creditPeriod || '30 Days',
              addedAt: new Date().toISOString().slice(0, 10),
            });
          }
        });
        return [...toAdd, ...prev];
      });
    } else if (newCalls.length > 0) {
      setCampaignContacts((prev) => {
        const existingPhones = new Set(prev.map((c) => c.phno.replace(/[^0-9]/g, '')));
        const toAdd: CampaignContact[] = [];
        newCalls.forEach((nc) => {
          const rawPh = nc.ph.replace(/[^0-9]/g, '');
          if (!existingPhones.has(rawPh)) {
            existingPhones.add(rawPh);
            toAdd.push({
              id: 'C' + (prev.length + toAdd.length + 1),
              name: nc.name,
              phno: nc.ph,
              creditPeriod: '30 Days',
              addedAt: new Date().toISOString().slice(0, 10),
            });
          }
        });
        return [...toAdd, ...prev];
      });
    }
  };

  const perm = (scr: ScreenKey, r: RoleKey = role): PermissionLevel => {
    return PERM[scr]?.[r] || 'F';
  };

  const canAct = (scr: ScreenKey): boolean => {
    const p = perm(scr);
    return ['F', 'A'].includes(p);
  };

  const me = (): string => {
    return users.find((u) => u.role === role)?.n || 'You';
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        viewState,
        setViewState,
        isLoggedIn,
        setIsLoggedIn,
        login,
        logout,
        selectedRetailerId,
        setSelectedRetailerId,
        selectedCallId,
        setSelectedCallId,
        collectionsTab,
        setCollectionsTab,
        escalations,
        addEscalation,
        assignEscalation,
        resolveEscalation,
        tickets: escalations,
        addTicket,
        updateTicket,
        careContacts,
        addContact,
        campaignContacts,
        addCampaignContact,
        users,
        updateUser,
        config,
        updateConfig,
        batches,
        addBatch,
        selectedBatchId,
        setSelectedBatchId,
        downloadBatchReport,
        scheduledCallbacks,
        rescheduleCall,
        triggerImmediateDial,
        cancelScheduledCall,
        addScheduledCallback,
        retailers,
        calls,
        addCalls,
        toast,
        showToast,
        modal,
        openModal,
        closeModal,
        canAct,
        perm,
        me,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
