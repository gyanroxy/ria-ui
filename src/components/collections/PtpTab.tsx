'use client';

import React from 'react';
import Link from 'next/link';
import { PTPS, PTP_ST } from '@/data/mockData';
import { inr } from '@/utils/formatters';
import ActionButton from '../common/ActionButton';
import { useApp } from '@/context/AppContext';

export default function PtpTab() {
  const { showToast, setSelectedRetailerId } = useApp();

  const dueSum = PTPS.filter((p) => p.st === 'due').reduce((a, p) => a + p.amt, 0);
  const upSum = PTPS.filter((p) => p.st === 'upcoming').reduce((a, p) => a + p.amt, 0);
  const keptSum = PTPS.filter((p) => p.st === 'kept').reduce((a, p) => a + p.amt, 0);
  const brokenSum = PTPS.filter((p) => p.st === 'broken').reduce((a, p) => a + p.amt, 0);

  return (
    <div>
      <div className="ptp-sum">
        <div>
          <span>Due Today</span>
          <span className="num" style={{ color: 'var(--gold)' }}>{inr(dueSum)}</span>
        </div>
        <div>
          <span>Upcoming (14d)</span>
          <span className="num" style={{ color: 'var(--blue)' }}>{inr(upSum)}</span>
        </div>
        <div>
          <span>Kept MTD</span>
          <span className="num" style={{ color: 'var(--green)' }}>{inr(keptSum)}</span>
        </div>
        <div>
          <span>Broken (Action Needed)</span>
          <span className="num" style={{ color: 'var(--red)' }}>{inr(brokenSum)}</span>
        </div>
      </div>

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Retailer Account</th>
              <th>PTP Date</th>
              <th className="right">Committed Amt</th>
              <th>Status</th>
              <th>Autonomy</th>
              <th className="right">Action</th>
            </tr>
          </thead>
          <tbody>
            {PTPS.map((p) => {
              const stInfo = PTP_ST[p.st] || ['Unknown', 'c-grey'];
              return (
                <tr key={p.id}>
                  <td>
                    <Link
                      href={`/retailers/${p.ret}`}
                      onClick={() => setSelectedRetailerId(p.ret)}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div className="name link">{p.name}</div>
                      <div className="meta">{p.ph} · {p.id}</div>
                    </Link>
                  </td>
                  <td className="num">{p.due}</td>
                  <td className="num right">{inr(p.amt)}</td>
                  <td>
                    <span className={`chip ${stInfo[1]}`}>{stInfo[0]}</span>
                  </td>
                  <td>
                    <span className="ai-tag">{p.auto}</span>
                  </td>
                  <td className="right">
                    {p.st === 'broken' ? (
                      <ActionButton
                        auto={p.auto}
                        label="Assign Field Visit"
                        className="btn-red btn-sm"
                        screen="collections"
                        onClick={() => showToast(`Field executive assigned to visit ${p.name}`)}
                      />
                    ) : p.st === 'due' ? (
                      <ActionButton
                        auto={p.auto}
                        label="Send Payment Link"
                        className="btn-green btn-sm"
                        screen="collections"
                        onClick={() => showToast(`WhatsApp payment link dispatched to ${p.ph}`)}
                      />
                    ) : (
                      <ActionButton
                        auto={p.auto}
                        label="Send Reminder"
                        className="btn-ghost btn-sm"
                        screen="collections"
                        onClick={() => showToast(`Reminder queued for ${p.due}`)}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
