'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { CallItem, Retailer } from '@/types';
import AudioTranscript from './AudioTranscript';
import ActionButton from '../common/ActionButton';
import { inr } from '@/utils/formatters';

export default function CallDetailView({ callId }: { callId?: string }) {
  const {
    calls,
    retailers,
    scheduledCallbacks,
    selectedCallId,
    setSelectedRetailerId,
    triggerImmediateDial,
    showToast,
    addTicket,
  } = useApp();

  const idToFind = callId || selectedCallId || 'CL-4416';
  const call = calls.find((c) => c.id === idToFind) || calls[0];
  const retailer = retailers.find((r) => r.id === call.ret || r.name === call.name) || retailers[0];

  const scheduledItem = scheduledCallbacks.find(
    (s) => s.sourceCallId === call.id || s.name === call.name
  );

  const handleCreateTicket = () => {
    addTicket({
      cust: call.name,
      cat: call.disp.includes('Dispute') ? 'Payment dispute' : 'Broken promise',
      st: 'Open',
      src: `Call ${call.id}`,
      who: 'Suresh Raina',
    });
  };

  return (
    <div>
      {scheduledItem && (
        <div
          className="card"
          style={{
            marginBottom: '14px',
            background: 'linear-gradient(90deg, #F0FDF4 0%, #FFFFFF 100%)',
            border: '1px solid #86EFAC',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>⏰</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#166534' }}>
                  Autonomous Next Attempt Scheduled
                </span>
                <span className="chip c-green" style={{ fontWeight: 700 }}>
                  {scheduledItem.scheduledTime} ({scheduledItem.relativeDue})
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--t2)', marginTop: '2px' }}>
                Context: {scheduledItem.aiNote}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => triggerImmediateDial(scheduledItem.id)}
            >
              📞 Dial Immediately
            </button>
          </div>
        </div>
      )}

      <div className="grid g4" style={{ marginBottom: '14px' }}>
        <div className="tile navy">
          <div className="n">{call.id}</div>
          <div className="l">Call Reference</div>
          <div className="d">{call.time} · {call.dur} duration</div>
        </div>
        <div className="tile teal">
          <div className="n">{call.disp}</div>
          <div className="l">Captured Disposition</div>
          <div className="d">Language: {call.lang}</div>
        </div>
        <div className="tile">
          <div className="n">{call.score}%</div>
          <div className="l">Cooperation Sentiment</div>
          <div className="d">NLP speech confidence score</div>
        </div>
        <div className="tile gold">
          <div className="n">{call.ptp !== 'None' ? call.ptp : 'No PTP'}</div>
          <div className="l">PTP Commitment</div>
          <div className="d">Autonomy level: {call.auto}</div>
        </div>
      </div>

      <div className="split">
        <AudioTranscript turns={call.turns} audioFile={call.audio} />

        <div className="grid" style={{ gap: '14px' }}>
          <div className="card">
            <div className="card-h">
              <h3>Retailer Account Snapshot</h3>
              <div className="r">
                <Link
                  href={`/retailers/${retailer.id}`}
                  onClick={() => setSelectedRetailerId(retailer.id)}
                  className="link"
                  style={{ fontSize: '12px' }}
                >
                  View 360° Profile →
                </Link>
              </div>
            </div>
            <div className="card-b">
              <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>
                {retailer.name}
              </div>
              <div className="meta" style={{ marginBottom: '12px' }}>
                {retailer.city} · {retailer.phone}
              </div>

              <dl className="kv">
                <dt>Retailer Code</dt>
                <dd className="mono">{retailer.code}</dd>
                <dt>Total Outstanding</dt>
                <dd className="num">{inr(retailer.os)}</dd>
                <dt>Overdue Balance</dt>
                <dd className="num" style={{ color: 'var(--red)' }}>{inr(retailer.od)}</dd>
                <dt>Aging Bucket</dt>
                <dd><span className="chip c-gold">{retailer.bucket}</span></dd>
                <dt>Credit Limit</dt>
                <dd className="num">{inr(retailer.lim)}</dd>
              </dl>
            </div>
          </div>

          <div className="card">
            <div className="card-h">
              <h3>Evidence & Recommended Next Step</h3>
            </div>
            <div className="card-b">
              <div className="rail" style={{ marginBottom: '14px' }}>
                <h4>RIA Autonomous Recommendation:</h4>
                <div style={{ fontSize: '13px', color: 'var(--t2)' }}>
                  {call.disp.includes('PTP')
                    ? 'Retailer committed to pay ₹1,00,000 on April 18 via RTGS. Send WhatsApp reminder link 24 hours prior.'
                    : call.disp.includes('Dispute')
                    ? 'Damaged goods claimed on invoice 0774. Freeze overdue penalties and route to Credit Manager for credit note evaluation.'
                    : 'Account non-responsive across multiple attempts. Escalate to field sales executive.'}
                </div>
              </div>

              <div style={{ display: 'grid', gap: '8px' }}>
                {call.disp.includes('PTP') && (
                  <ActionButton
                    auto={call.auto}
                    label="Send WhatsApp Payment Link"
                    className="btn-green btn-block"
                    screen="calldetail"
                    onClick={() => showToast(`Payment link dispatched to ${call.ph}`)}
                  />
                )}
                <button
                  className="btn btn-primary btn-block"
                  onClick={handleCreateTicket}
                >
                  Create Customer Care Ticket
                </button>
                <ActionButton
                  auto={call.auto}
                  label="Place Follow-up Call"
                  className="btn-ghost btn-block"
                  screen="calldetail"
                  onClick={() => showToast(`Outbound telecalling agent dialing ${call.ph}...`)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
