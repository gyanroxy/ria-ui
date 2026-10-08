'use client';

import React from 'react';
import { REPORTS, PTPS, NOLIFT, ESCALATIONS } from '@/data/mockData';
import { downloadCSV } from '@/utils/formatters';
import { useApp } from '@/context/AppContext';

export default function ReportsCard() {
  const { showToast, calls } = useApp();

  const handleDownload = (k: string, fn: string) => {
    if (k === 'daily_summary') {
      const rows = [
        ['Call ID', 'Retailer ID', 'Name', 'Phone', 'Time', 'Language', 'Duration', 'Disposition', 'PTP Date', 'Autonomy Level', 'Sentiment Score'],
        ...calls.map((c) => [c.id, c.ret, c.name, c.ph, c.time, c.lang, c.dur, c.disp, c.ptp, c.auto, c.score]),
      ];
      downloadCSV(fn, rows);
    } else if (k === 'ptp_pipeline') {
      const rows = [
        ['PTP ID', 'Retailer ID', 'Name', 'Phone', 'Due Date', 'Amount (INR)', 'Status', 'Autonomy Level'],
        ...PTPS.map((p) => [p.id, p.ret, p.name, p.ph, p.due, p.amt, p.st, p.auto]),
      ];
      downloadCSV(fn, rows);
    } else if (k === 'disputes') {
      const rows = [
        ['Escalation REF', 'Customer', 'Category', 'Severity', 'Owner', 'Age', 'Source Call'],
        ...ESCALATIONS.map((e) => [e.id, e.customer, e.category, e.severity, e.owner, e.age, e.sourceCallId]),
      ];
      downloadCSV(fn, rows);
    } else if (k === 'no_lift') {
      const rows = [
        ['Retailer ID', 'Name', 'Phone', 'Attempts', 'Last Call', 'Next Scheduled Attempt', 'Autonomy Level'],
        ...NOLIFT.map((n) => [n.ret, n.name, n.ph, n.att, n.last, n.next, n.auto]),
      ];
      downloadCSV(fn, rows);
    } else {
      const rows = [
        ['Timestamp', 'Actor', 'Role', 'Action', 'Target', 'Details'],
        ['2026-04-14 08:30:12', 'Vishal T.', 'OW', 'CSV Import', 'calls_2026_04_14.csv', '240 rows ingested, 2 rejected'],
        ['2026-04-14 09:12:44', 'Suresh Raina', 'CM', 'PTP Approval', 'PTP-102 (₹45,000)', 'Approved WhatsApp payment link trigger'],
        ['2026-04-14 10:45:00', 'RIA System', 'L2', 'Automated Call', 'CL-4416', 'Captured PTP ₹1,00,000 for Apr 18'],
        ['2026-04-14 11:18:22', 'RIA System', 'L1', 'Escalation Raised', 'E-311', 'Dispute reported: Damaged stock on INV-0774'],
      ];
      downloadCSV(fn, rows);
    }
    showToast(`Downloaded ${fn}`);
  };

  return (
    <div className="card">
      <div className="card-h">
        <h3>Standard Exports & Reports</h3>
        <span className="sub">Pre-formatted audit-ready CSV exports</span>
      </div>
      <div className="card-b" style={{ padding: 0 }}>
        {REPORTS.map((r) => (
          <div key={r.k} className="list-row">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="name">{r.n}</div>
              <div className="meta">{r.d}</div>
            </div>
            <div className="rr">
              <span className="chip c-grey">{r.fmt}</span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handleDownload(r.k, r.fn)}
              >
                Download CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
