'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { CallBatch, CallItem } from '@/types';

interface BatchReportViewProps {
  batchId: string;
  onBack: () => void;
}

export default function BatchReportView({ batchId, onBack }: BatchReportViewProps) {
  const { batches, calls, downloadBatchReport, setSelectedCallId, setSelectedRetailerId } = useApp();
  const [dispFilter, setDispFilter] = useState('ALL');
  const [langFilter, setLangFilter] = useState('ALL');
  const [query, setQuery] = useState('');

  const batch = batches.find((b) => b.id === batchId) || batches[0];

  // Resolve calls that belong to this batch. If batch.calls is populated, use that, or filter calls by batchId or fallback
  const batchCalls: CallItem[] =
    batch.calls && batch.calls.length > 0
      ? batch.calls
      : calls.filter((c) => c.batchId === batch.id).length > 0
      ? calls.filter((c) => c.batchId === batch.id)
      : calls;

  const filteredCalls = batchCalls.filter((c) => {
    if (dispFilter !== 'ALL' && !c.disp.toLowerCase().includes(dispFilter.toLowerCase())) return false;
    if (langFilter !== 'ALL' && c.lang.toLowerCase() !== langFilter.toLowerCase()) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.ph.includes(q) && !c.id.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const getDispChipClass = (disp: string) => {
    const d = disp.toLowerCase();
    if (d.includes('ptp')) return 'c-green';
    if (d.includes('dispute') || d.includes('broken')) return 'c-red';
    if (d.includes('not lifted')) return 'c-gold';
    if (d.includes('already paid')) return 'c-blue';
    if (d.includes('queued')) return 'c-teal';
    return 'c-grey';
  };

  const connectRate =
    batch.totalCalls > 0 ? Math.round((batch.connectedCalls / batch.totalCalls) * 100) : 0;

  return (
    <div className="batch-report-view">
      {/* Top Navigation & Actions */}
      <div
        className="card"
        style={{
          marginBottom: '16px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFCFF 100%)',
          border: '1px solid #DCE6F5',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            paddingBottom: '14px',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onBack}
              style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              ← Back to All Batches
            </button>
            <div style={{ height: '20px', width: '1px', background: 'var(--line)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ fontWeight: 700, fontSize: '15px', color: 'var(--navy)' }}>
                {batch.id}
              </span>
              <span
                className={`chip ${
                  batch.status === 'Completed'
                    ? 'c-green'
                    : batch.status === 'In Progress'
                    ? 'c-blue'
                    : 'c-gold'
                }`}
              >
                {batch.status}
              </span>
            </div>
          </div>

          {/* Download Action */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => downloadBatchReport(batch)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
            >
              <span>📥</span>
              <span>Download Batch Report (CSV)</span>
            </button>
          </div>
        </div>

        {/* Batch Metadata Header */}
        <div style={{ paddingTop: '14px' }}>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: 700, color: 'var(--t1)' }}>
            {batch.name}
          </h2>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              fontSize: '13px',
              color: 'var(--t2)',
            }}
          >
            <div>
              <span>Generated: </span>
              <b style={{ color: 'var(--t1)' }}>{batch.createdAt}</b>
            </div>
            <div>
              <span>Imported By: </span>
              <b style={{ color: 'var(--t1)' }}>{batch.importedBy}</b>
            </div>
            <div>
              <span>Source File: </span>
              <span className="mono" style={{ color: 'var(--navy)', fontWeight: 600 }}>
                {batch.fileName}
              </span>
            </div>
            <div>
              <span>Total Accounts in Sheet: </span>
              <b style={{ color: 'var(--t1)' }}>{batch.totalCalls}</b>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Performance Tiles */}
      <div className="grid g5" style={{ marginBottom: '16px' }}>
        <div className="card" style={{ padding: '12px 14px' }}>
          <div className="meta" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
            Total Calls In Batch
          </div>
          <div className="num" style={{ fontSize: '22px', fontWeight: 700, marginTop: '4px', color: 'var(--t1)' }}>
            {batch.totalCalls}
          </div>
          <span className="meta" style={{ fontSize: '11px' }}>{batch.completedCalls} dialed</span>
        </div>

        <div className="card" style={{ padding: '12px 14px', background: 'var(--blue-soft)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--navy)' }}>
            Connected Rate
          </div>
          <div className="num" style={{ fontSize: '22px', fontWeight: 700, marginTop: '4px', color: 'var(--navy)' }}>
            {connectRate}%
          </div>
          <span style={{ fontSize: '11px', color: 'var(--navy)' }}>{batch.connectedCalls} connected</span>
        </div>

        <div className="card" style={{ padding: '12px 14px', background: 'var(--green-soft)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#0E6039' }}>
            PTPs Committed
          </div>
          <div className="num" style={{ fontSize: '22px', fontWeight: 700, marginTop: '4px', color: '#0E6039' }}>
            {batch.ptpCount}
          </div>
          <span style={{ fontSize: '11px', color: '#0E6039', fontWeight: 600 }}>
            ₹{(batch.ptpAmount / 100000).toFixed(2)} Lakhs
          </span>
        </div>

        <div className="card" style={{ padding: '12px 14px', background: batch.disputeCount > 0 ? 'var(--red-soft)' : '#FFF' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: batch.disputeCount > 0 ? 'var(--red)' : 'var(--t3)' }}>
            Disputes / Tickets
          </div>
          <div className="num" style={{ fontSize: '22px', fontWeight: 700, marginTop: '4px', color: batch.disputeCount > 0 ? 'var(--red)' : 'var(--t1)' }}>
            {batch.disputeCount}
          </div>
          <span className="meta" style={{ fontSize: '11px' }}>Escalated to team</span>
        </div>

        <div className="card" style={{ padding: '12px 14px', background: batch.noLiftCount > 0 ? 'var(--gold-soft)' : '#FFF' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#8A5D00' }}>
            Calls Not Lifted
          </div>
          <div className="num" style={{ fontSize: '22px', fontWeight: 700, marginTop: '4px', color: '#8A5D00' }}>
            {batch.noLiftCount}
          </div>
          <span className="meta" style={{ fontSize: '11px' }}>Auto-retry scheduled</span>
        </div>
      </div>

      {/* Batch Calls Detailed Table */}
      <div className="card">
        <div className="card-h" style={{ borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
          <div>
            <h3 style={{ margin: 0 }}>Call Logs & Outcomes for {batch.id}</h3>
            <span className="sub">Every conversation record, disposition, and audio transcript</span>
          </div>
          <div className="r">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => downloadBatchReport(batch)}
            >
              Export This Batch CSV
            </button>
          </div>
        </div>

        <div className="filters" style={{ marginTop: '12px' }}>
          <input
            type="text"
            placeholder="Search within this batch by name, phone, or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ maxWidth: '300px', padding: '6px 10px', fontSize: '13px' }}
          />

          <select value={dispFilter} onChange={(e) => setDispFilter(e.target.value)}>
            <option value="ALL">All Dispositions ({batchCalls.length})</option>
            <option value="PTP">PTP Commitments</option>
            <option value="Dispute">Payment Disputes</option>
            <option value="Not lifted">Calls Not Lifted</option>
            <option value="Already-paid">Already-Paid Claims</option>
            <option value="Broken">Broken PTPs</option>
          </select>

          <select value={langFilter} onChange={(e) => setLangFilter(e.target.value)}>
            <option value="ALL">All Languages</option>
            <option value="Telugu">Telugu</option>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
            <option value="Tamil">Tamil</option>
            <option value="Kannada">Kannada</option>
          </select>

          <div className="sp">
            <span>
              Showing <b>{filteredCalls.length}</b> of <b>{batchCalls.length}</b> records
            </span>
          </div>
        </div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Call ID</th>
                <th>Retailer Account</th>
                <th>Phone Number</th>
                <th>Time</th>
                <th>Language</th>
                <th>Duration</th>
                <th>Disposition & Outcome</th>
                <th>PTP Date</th>
                <th className="right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCalls.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => {
                    setSelectedCallId(c.id);
                    setSelectedRetailerId(c.ret);
                  }}
                >
                  <td className="mono">
                    <Link
                      href={`/calls/${c.id}`}
                      className="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCallId(c.id);
                        setSelectedRetailerId(c.ret);
                      }}
                    >
                      {c.id}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/retailers/${c.ret}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRetailerId(c.ret);
                      }}
                    >
                      <div className="name link">{c.name}</div>
                    </Link>
                  </td>
                  <td className="mono">{c.ph}</td>
                  <td className="meta">{c.time}</td>
                  <td>
                    <span className="chip c-blue">{c.lang}</span>
                  </td>
                  <td className="num">{c.dur}</td>
                  <td>
                    <span className={`chip ${getDispChipClass(c.disp)}`}>{c.disp}</span>
                  </td>
                  <td className="mono" style={{ fontSize: '12px' }}>
                    {c.ptp && c.ptp !== 'None' && c.ptp !== '—' ? (
                      <span className="chip c-green">{c.ptp}</span>
                    ) : (
                      <span className="meta">—</span>
                    )}
                  </td>
                  <td className="right">
                    <Link href={`/calls/${c.id}`}>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCallId(c.id);
                          setSelectedRetailerId(c.ret);
                        }}
                      >
                        Listen & View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
