'use client';

import React from 'react';
import Link from 'next/link';
import { NOLIFT } from '@/data/mockData';
import ActionButton from '../common/ActionButton';
import { useApp } from '@/context/AppContext';

export default function NoLiftTab() {
  const { showToast, setSelectedRetailerId } = useApp();

  return (
    <div className="tbl-wrap">
      <table>
        <thead>
          <tr>
            <th>Retailer Account</th>
            <th>Attempts Made</th>
            <th>Last Attempt</th>
            <th>Next Scheduled Attempt</th>
            <th>Autonomy</th>
            <th className="right">Action</th>
          </tr>
        </thead>
        <tbody>
          {NOLIFT.map((n) => (
            <tr key={n.ret}>
              <td>
                <Link
                  href={`/retailers/${n.ret}`}
                  onClick={() => setSelectedRetailerId(n.ret)}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="name link">{n.name}</div>
                  <div className="meta">{n.ph} · {n.ret}</div>
                </Link>
              </td>
              <td>
                <span
                  className="num"
                  style={{
                    color: n.att >= 3 ? 'var(--red)' : 'var(--gold)',
                    fontWeight: 700,
                  }}
                >
                  {n.att} of 3
                </span>
              </td>
              <td className="meta">{n.last}</td>
              <td className="meta" style={{ fontWeight: 600, color: 'var(--t1)' }}>
                {n.next}
              </td>
              <td>
                <span className="ai-tag">{n.auto}</span>
              </td>
              <td className="right">
                {n.att >= 3 ? (
                  <ActionButton
                    auto={n.auto}
                    label="Send WhatsApp Notice"
                    className="btn-red btn-sm"
                    screen="collections"
                    onClick={() => showToast(`Formal overdue notice sent via WhatsApp to ${n.ph}`)}
                  />
                ) : (
                  <ActionButton
                    auto={n.auto}
                    label="Retry Call Now"
                    className="btn-ghost btn-sm"
                    screen="collections"
                    onClick={() => showToast(`Outbound retry triggered for ${n.name}`)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
