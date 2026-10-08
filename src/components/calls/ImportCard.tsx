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
              <th>Business Name</th>
              <th>Phone</th>
              <th>Invoice Date</th>
              <th>Invoice Number</th>
              <th className="right">Invoice Amount</th>
            </tr>
          </thead>
          <tbody>
            {imp.valid.slice(0, 5).map((v, i) => (
              <tr key={i}>
                <td><b>{v.businessName || v.name}</b></td>
                <td className="mono">{v.phone}</td>
                <td className="mono" style={{ fontSize: '12px' }}>{v.invoiceDate || v.dueDate || '—'}</td>
                <td className="mono">{v.invoiceNumber || v.code}</td>
                <td className="num right" style={{ color: 'var(--navy)' }}>₹{Number(v.invoiceAmount || v.amount || 0).toLocaleString('en-IN')}</td>
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

    const cBusiness = mapCol('business_name');
    const cPhone = mapCol('phno');
    const cInvDate = mapCol('invoice_date');
    const cInvNum = mapCol('invoice_number');
    const cInvAmt = mapCol('invoice_amount');
    const cLang = mapCol('lang');

    const valid: any[] = [];
    const rejects: { row: any; reason: string }[] = [];
    let totalOd = 0;

    for (let i = 1; i < rawRows.length; i++) {
      const r = rawRows[i];
      const businessName = cBusiness !== -1 ? r[cBusiness] : '';
      const phoneRaw = cPhone !== -1 ? r[cPhone] : '';
      const cleanPhone = phoneRaw.replace(/[^0-9]/g, '');

      if (!businessName || businessName.trim().length === 0) {
        rejects.push({ row: r, reason: 'Business name is missing' });
        continue;
      }
      if (cleanPhone.length < 10) {
        rejects.push({ row: r, reason: `Invalid phone number: ${phoneRaw}` });
        continue;
      }

      const invoiceDateVal = cInvDate !== -1 && r[cInvDate] ? r[cInvDate].trim() : '2026-04-18';
      const invoiceNumVal = cInvNum !== -1 && r[cInvNum] ? r[cInvNum].trim() : `INV-${1000 + i}`;
      const amountVal = cInvAmt !== -1 ? parseFloat(r[cInvAmt].replace(/[^0-9.-]/g, '')) || 0 : 0;
      totalOd += amountVal;

      valid.push({
        code: invoiceNumVal,
        businessName: businessName.trim(),
        name: businessName.trim(),
        phone: cleanPhone.length === 10 ? `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}` : `+${cleanPhone}`,
        invoiceNumber: invoiceNumVal,
        invoiceDate: invoiceDateVal,
        invoiceAmount: amountVal,
        amount: amountVal,
        od: amountVal,
        dueDate: invoiceDateVal,
        lang: cLang !== -1 && r[cLang] ? r[cLang].trim() : 'Telugu',
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
            ret: v.invoiceNumber || `R-${idx + 1}`,
            name: v.businessName,
            ph: v.phone,
            time: 'Queued',
            lang: v.lang,
            dur: '—',
            disp: 'Queued for dialing',
            ptp: v.invoiceDate || '—',
            auto: 'L2',
            audio: 'rec-queued.wav',
            score: 80,
            batchId: newBatchId,
            turns: [
              { who: 'RIA', lang: 'te', txt: `నమస్కారం ${v.businessName} గారూ! రాక్సీ డిస్ట్రిబ్యూటర్స్ నుంచి ఆర్ఐఏ (RIA) ని మాట్లాడుతున్నాను.` }
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
            name: v.businessName,
            phno: v.phone,
            creditPeriod: '30 Days',
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
    const sample = `business name,phno,invoice date,invoice number,invoice amount
Sri Balaji Kirana & General Store,+91 98490 22114,2026-04-18,INV-2026-001,180000
Lakshmi Super Bazar,+91 97001 88342,2026-04-15,INV-2026-002,380000
Ganesh Provision Store,+91 94400 12789,2026-04-20,INV-2026-003,45000
Shree Krishna Traders,+91 98850 66321,2026-04-10,INV-2026-004,520000
New Bharat Medical & General,+91 99123 45670,2026-04-16,INV-2026-005,140000
Durga Bhavani Stores,+91 96521 90812,2026-04-22,INV-2026-006,185000
Maruthi Fancy & General,+91 98499 88771,2026-04-19,INV-2026-007,110000
Balaji Agencies & Stores,+91 98490 88219,2026-04-25,INV-2026-008,90000`;
    processText('sample_daily_calls.csv', sample);
  };

  const downloadTemplate = () => {
    const rows = [
      ['business name', 'phno', 'invoice date', 'invoice number', 'invoice amount'],
      ['Sri Balaji Kirana & General Store', '+91 98490 22114', '2026-04-18', 'INV-2026-001', '180000'],
      ['Lakshmi Super Bazar', '+91 97001 88342', '2026-04-15', 'INV-2026-002', '380000'],
      ['Ganesh Provision Store', '+91 94400 12789', '2026-04-20', 'INV-2026-003', '45000'],
      ['Shree Krishna Traders', '+91 98850 66321', '2026-04-10', 'INV-2026-004', '520000'],
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
            <div><span className="mono">business name</span> <span className="meta">Retailer store or commercial trade name</span></div>
            <div><span className="mono">phno</span> <span className="meta">10-digit Indian mobile / contact number</span></div>
            <div><span className="mono">invoice date</span> <span className="meta">Invoice issue or due date (YYYY-MM-DD)</span></div>
            <div><span className="mono">invoice number</span> <span className="meta">ERP invoice or bill reference (e.g. INV-2026-001)</span></div>
            <div><span className="mono">invoice amount</span> <span className="meta">Total overdue or billed invoice balance (INR)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
