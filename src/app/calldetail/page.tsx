'use client';

import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import PageHead from '@/components/common/PageHead';
import CallDetailView from '@/components/calldetail/CallDetailView';
import { useApp } from '@/context/AppContext';

export default function CallDetailIndexPage() {
  const { selectedCallId, calls, setSelectedCallId } = useApp();

  return (
    <AppShell screenKey="calldetail">
      <PageHead
        screenKey="calldetail"
        rightAction={
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select
              value={selectedCallId}
              onChange={(e) => setSelectedCallId(e.target.value)}
              style={{ padding: '6px 10px', fontSize: '13px', borderRadius: '7px' }}
            >
              {calls.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.name}
                </option>
              ))}
            </select>
            <Link href="/calls" className="link" style={{ fontSize: '13px' }}>
              ← All Calls
            </Link>
          </div>
        }
      />

      <CallDetailView callId={selectedCallId} />
    </AppShell>
  );
}
