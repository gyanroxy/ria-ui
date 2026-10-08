'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { CSV_ALIASES } from '@/data/mockData';
import { parseCSV, downloadCSV } from '@/utils/formatters';
import { CallItem } from '@/types';

interface ParsedImport {
  filename: string;
  total: number;
  valid: any[];
  rejects: { row: any; reason: string }[];
  totalOd: number;
}

export function ImportPreviewModalContent({
  imp,
  onClose,
  onSchedule,
}: {
  imp: ParsedImport;
  onClose: () => void;
  onSchedule: () => void;
}) {
  const handleDownloadRejects = () => {
    const rows = [
      ['Row Number', 'Raw Data', 'Reason For Rejection'],
      ...imp.rejects.map((r, i) => [i + 1, JSON.stringify(r.row), r.reason]),
    ];
    downloadCSV(`rejects_${imp.filename}`, rows);
  };

  return (
    <div>
      <div className="grid g3" style={{ marginBottom: '14px' }}>
        <div style={{ background: 'var(--green-soft)', padding: '10px 12px', borderRadius: '8px', border: '1px solid #BFE0CD' }}>
          <span style={{ fontSize: '11px', color: '#0E6039', fontWeight: 700, textTransform: 'uppercase' }}>Ready to Dial</span>
          <div className="num" style={{ fontSize: '20px', color: '#0E6039' }}>{imp.valid.length} accounts</div>
        </div>
        <div style={{ background: imp.rejects.length > 0 ? 'var(--red-soft)' : '#F4F6FA', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)' }}>
          <span style={{ fontSize: '11px', color: 'var(--t2)', fontWeight: 700, textTransform: 'uppercase' }}>Rejected / Invalid</span>
          <div className="num" style={{ fontSize: '20px', color: imp.rejects.length > 0 ? 'var(--red)' : 'var(--t1)' }}>{imp.rejects.length} rows</div>
        </div>
        <div style={{ background: 'var(--blue-soft)', padding: '10px 12px', borderRadius: '8px', border: '1px solid #C9DCFA' }}>
          <span style={{ fontSize: '11px', color: 'var(--navy)', fontWeight: 700, textTransform: 'uppercase' }}>Overdue In Batch</span>
          <div className="num" style={{ fontSize: '20px', color: 'var(--navy)' }}>₹{(imp.totalOd / 100000).toFixed(2)} L</div>
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--t2)' }}>First 5 Accounts in Dialing Queue:</span>
      </div>

      <div className="tbl-wrap" style={{ maxHeight: '240px', border: '1px solid var(--line)', borderRadius: '8px', marginBottom: '16px' }}>
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>Business / Store</th>
              <th className="right">Amount</th>
              <th className="right">Due Amount</th>
              <th>Due Date</th>
              <th>Credit Period</th>
            </tr>
          </thead>
          <tbody>
            {imp.valid.slice(0, 5).map((v, i) => (
              <tr key={i}>
                <td><b>{v.name}</b></td>
                <td className="mono">{v.phone}</td>
                <td>{v.business || 'Retailer Account'}</td>
                <td className="num right">₹{Number(v.amount || 0).toLocaleString('en-IN')}</td>
                <td className="num right" style={{ color: 'var(--red)' }}>₹{Number(v.od || 0).toLocaleString('en-IN')}</td>
                <td className="mono" style={{ fontSize: '12px' }}>{v.dueDate || '—'}</td>
                <td><span className="chip c-blue">{v.creditPeriod || '30 Days'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="m-f" style={{ margin: '18px -18px -18px', padding: '14px 18px', display: 'flex', gap: '8px', justifyContent: 'flex-end', background: '#FAFBFE' }}>
        {imp.rejects.length > 0 && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleDownloadRejects}>
            Download Rejected ({imp.rejects.length})
          </button>
        )}
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={onSchedule}>
          Schedule Outbound Batch ({imp.valid.length} calls)
        </button>
      </div>
    </div>
  );
}

export default function ImportCard() {
  const { showToast, addCalls, addBatch, batches, me, setSelectedBatchId, openModal, closeModal } = useApp();
  const [isOver, setIsOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processText = (filename: string, text: string) => {
    const rawRows = parseCSV(text);
    if (rawRows.length < 2) {
      showToast('CSV must contain a header row and at least 1 data row.');
      return;
    }

    const headers = rawRows[0].map((h) => h.toLowerCase().trim().replace(/[^a-z0-9_]/g, '_'));
    const mapCol = (canonical: string) => {
      const aliases = CSV_ALIASES[canonical] || [canonical];
      return headers.findIndex((h) => aliases.some((a) => h === a || h.includes(a)));
    };

    const cName = mapCol('name');
    const cPhone = mapCol('phno');
    const cBusiness = mapCol('business');
    const cAmount = mapCol('amount');
    const cDueAmount = mapCol('due_amount');
    const cDueDate = mapCol('due_date');
    const cCredit = mapCol('credit_period');
    const cLang = mapCol('lang');

    const valid: any[] = [];
    const rejects: { row: any; reason: string }[] = [];
    let totalOd = 0;

    for (let i = 1; i < rawRows.length; i++) {
      const r = rawRows[i];
      const name = cName !== -1 ? r[cName] : '';
      const phoneRaw = cPhone !== -1 ? r[cPhone] : '';
      const cleanPhone = phoneRaw.replace(/[^0-9]/g, '');

      if (!name || name.trim().length === 0) {
        rejects.push({ row: r, reason: 'Customer name is missing' });
        continue;
      }
      if (cleanPhone.length < 10) {
        rejects.push({ row: r, reason: `Invalid phone number: ${phoneRaw}` });
        continue;
      }

      const businessVal = cBusiness !== -1 && r[cBusiness] ? r[cBusiness].trim() : name.trim();
      const amountVal = cAmount !== -1 ? parseFloat(r[cAmount].replace(/[^0-9.-]/g, '')) || 0 : 0;
      const dueAmountVal = cDueAmount !== -1 ? parseFloat(r[cDueAmount].replace(/[^0-9.-]/g, '')) || amountVal : amountVal;
      totalOd += dueAmountVal;

      const dueDateVal = cDueDate !== -1 && r[cDueDate] ? r[cDueDate].trim() : '2026-04-18';
      const creditVal = cCredit !== -1 && r[cCredit] ? r[cCredit].trim() : '30 Days';

      valid.push({
        code: `RET-${1000 + i}`,
        name: name.trim(),
        business: businessVal,
        phone: cleanPhone.length === 10 ? `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}` : `+${cleanPhone}`,
        amount: amountVal || dueAmountVal,
        od: dueAmountVal,
        dueDate: dueDateVal,
        lang: cLang !== -1 && r[cLang] ? r[cLang].trim() : 'Telugu',
        creditPeriod: creditVal,
      });
    }

    const parsedData: ParsedImport = { filename, total: rawRows.length - 1, valid, rejects, totalOd };

    openModal(
      `Call Sheet Validation — ${filename}`,
      <ImportPreviewModalContent
        imp={parsedData}
        onClose={closeModal}
        onSchedule={() => {
          const batchSuffix = String.fromCharCode(65 + (batches.length % 26));
          const dateStr = new Date().toISOString().slice(0, 10);
          const newBatchId = `BATCH-${dateStr}-${batchSuffix}`;

          const generatedCalls: CallItem[] = valid.map((v, idx) => ({
            id: `CL-${5000 + idx}`,
            ret: `R-${idx + 1}`,
            name: v.business ? `${v.business} (${v.name})` : v.name,
            ph: v.phone,
            time: 'Queued',
            lang: v.lang,
            dur: '—',
            disp: 'Queued for dialing',
            ptp: v.dueDate || '—',
            auto: 'L2',
            audio: 'rec-queued.wav',
            score: 80,
            batchId: newBatchId,
            turns: [
              { who: 'RIA', lang: 'te', txt: `నమస్కారం ${v.name} గారూ! రాక్సీ డిస్ట్రిబ్యూటర్స్ నుంచి ఆర్ఐఏ (RIA) ని మాట్లాడుతున్నాను.` }
            ]
          }));

          const newBatch = {
            id: newBatchId,
            name: `${filename.replace(/\.csv$/i, '')} Run`,
            createdAt: 'Just now',
            importedBy: me(),
            fileName: filename,
            totalCalls: valid.length,
            completedCalls: 0,
            connectedCalls: 0,
            ptpCount: 0,
            ptpAmount: 0,
            disputeCount: 0,
            noLiftCount: 0,
            status: 'Scheduled' as const,
            calls: generatedCalls,
          };

          const newContacts = valid.map((v) => ({
            name: v.business ? `${v.name} — ${v.business}` : v.name,
            phno: v.phone,
            creditPeriod: v.creditPeriod || '30 Days',
          }));

          addBatch(newBatch);
          addCalls(generatedCalls, newContacts);
          setSelectedBatchId(newBatchId);
          closeModal();
          showToast(`Scheduled batch ${newBatchId} (${valid.length} calls)! Added customers to Contacts.`);
        }}
      />,
      undefined,
      true
    );
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      processText(file.name, text);
    };
    reader.readAsText(file);
  };

  const loadSample = () => {
    const sample = `name,phno,business,amount,due amount,due date,credit period
Venkatesh Rao,+91 98490 22114,Sri Balaji Kirana & General Store,245000,180000,2026-04-18,30 Days
Lakshmi Narayana,+91 97001 88342,Lakshmi Super Bazar,380000,380000,2026-04-15,45 Days
Ganesh Kumar,+91 94400 12789,Ganesh Provision Store,95000,45000,2026-04-20,30 Days
Ramesh Gupta,+91 98850 66321,Shree Krishna Traders,520000,520000,2026-04-10,60 Days
Bharat Shah,+91 99123 45670,New Bharat Medical & General,140000,140000,2026-04-16,30 Days
Durga Prasad,+91 96521 90812,Durga Bhavani Stores,185000,185000,2026-04-22,30 Days
Maruthi Reddy,+91 98499 88771,Maruthi Fancy & General,110000,110000,2026-04-19,30 Days
Balaji S.,+91 98490 88219,Balaji Agencies & Stores,90000,90000,2026-04-25,30 Days`;
    processText('sample_daily_calls.csv', sample);
  };

  const downloadTemplate = () => {
    const rows = [
      ['name', 'phno', 'business', 'amount', 'due amount', 'due date', 'credit period'],
      ['Venkatesh Rao', '+91 98490 22114', 'Sri Balaji Kirana & General Store', '245000', '180000', '2026-04-18', '30 Days'],
      ['Lakshmi Narayana', '+91 97001 88342', 'Lakshmi Super Bazar', '380000', '380000', '2026-04-15', '45 Days'],
      ['Ganesh Kumar', '+91 94400 12789', 'Ganesh Provision Store', '95000', '45000', '2026-04-20', '30 Days'],
      ['Ramesh Gupta', '+91 98850 66321', 'Shree Krishna Traders', '520000', '520000', '2026-04-10', '60 Days'],
    ];
    downloadCSV('ria_call_sheet_template.csv', rows);
    showToast('Downloaded ria_call_sheet_template.csv');
  };

  return (
    <div className="card" style={{ marginBottom: '18px' }}>
      <div className="card-h">
        <h3>Import Daily Call List (CSV)</h3>
        <span className="sub">Drop your ERP export sheet or distributor ledger</span>
        <div className="r">
          <button className="btn btn-ghost btn-sm" onClick={downloadTemplate}>
            Download template
          </button>
          <button className="btn btn-primary btn-sm" onClick={loadSample}>
            Load sample batch (240 calls)
          </button>
        </div>
      </div>
      <div className="card-b">
        <div className="imp-grid">
          <div
            className={`drop ${isOver ? 'over' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsOver(true);
            }}
            onDragLeave={() => setIsOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsOver(false);
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="big">📄</div>
            <div style={{ fontWeight: 600, marginTop: '6px' }}>Drag & drop your call sheet CSV here</div>
            <div className="meta" style={{ marginTop: '4px' }}>or click to browse from computer (UTF-8 encoded)</div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
            />
          </div>

          <div className="cols">
            <div style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--t3)' }}>
              Template Structure:
            </div>
            <div><span className="mono">name</span> <span className="meta">Customer / Owner full name</span></div>
            <div><span className="mono">phno</span> <span className="meta">10-digit Indian mobile number</span></div>
            <div><span className="mono">business</span> <span className="meta">Store or business entity name</span></div>
            <div><span className="mono">amount</span> <span className="meta">Total ledger balance / order (INR)</span></div>
            <div><span className="mono">due amount</span> <span className="meta">Overdue balance to collect (INR)</span></div>
            <div><span className="mono">due date</span> <span className="meta">Payment due date (YYYY-MM-DD)</span></div>
            <div><span className="mono">credit period</span> <span className="meta">Terms (e.g. 30 Days, 45 Days)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
