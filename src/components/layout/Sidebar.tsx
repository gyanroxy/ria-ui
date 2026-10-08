'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { NAV } from '@/data/mockData';

export default function Sidebar() {
  const pathname = usePathname();
  const { perm } = useApp();

  const activeKey = pathname.startsWith('/calls')
    ? 'calls'
    : pathname.startsWith('/calldetail')
    ? 'calls'
    : pathname.startsWith('/retailers')
    ? 'collections'
    : pathname.replace('/', '') || 'dashboard';

  return (
    <nav className="side">
      <div className="nav-label">Workspace</div>
      <div className="nav">
        {NAV.map((item) => {
          const p = perm(item.k);
          if (p === 'X') return null;
          const isActive = activeKey === item.k;

          return (
            <Link
              key={item.k}
              href={`/${item.k}`}
              className={isActive ? 'on' : ''}
              title={`${item.t} (${item.scr})`}
            >
              <span className="ic">{item.ic}</span>
              <span>{item.t}</span>
              {item.badge !== undefined && <span className="badge">{item.badge}</span>}
            </Link>
          );
        })}
      </div>
      <div className="side-foot">
        Autonomy ceiling <b>L2</b> in Phase 1.<br />
        RIA never acts without a review path.
      </div>
    </nav>
  );
}
