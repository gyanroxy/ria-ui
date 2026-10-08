'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ROLES, NAV, AV } from '@/data/mockData';
import { RoleKey, ViewState } from '@/types';
import { initials } from '@/utils/formatters';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole, viewState, setViewState, showToast, perm, me } = useApp();

  const activeKey = pathname.startsWith('/calls/') || pathname === '/calldetail'
    ? 'calls'
    : pathname.startsWith('/retailers')
    ? 'collections'
    : pathname.replace('/', '') || 'dashboard';

  const allowedNav = NAV.filter((n) => perm(n.k) !== 'X');

  const handleMobileNav = (key: string) => {
    router.push(`/${key}`);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      showToast('Search is wired to the retailer, call and action indexes.');
    }
  };

  const userInitial = initials(me());
  const avatarBg = AV[role] || '#0F2350';

  return (
    <header className="top">
      <Link href="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="brand">
          <div className="wm">
            RIA<small>DISTRIBUTION INTELLIGENCE</small>
          </div>
        </div>
      </Link>

      <div className="tenant">
        <span className="dot" />
        <span id="tenantName">Roxy Distributors LLP</span>
      </div>

      <div className="mobile-nav">
        <select value={activeKey} onChange={(e) => handleMobileNav(e.target.value)}>
          {allowedNav.map((n) => (
            <option key={n.k} value={n.k}>
              {n.t}
            </option>
          ))}
        </select>
      </div>

      <div className="search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#53617C" strokeWidth="2.4">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          type="text"
          placeholder="Search retailers, calls, actions…"
          onKeyDown={handleSearch}
        />
      </div>

      <div className="top-right">
        <div className="ctrl">
          <span>Role</span>
          <select value={role} onChange={(e) => setRole(e.target.value as RoleKey)}>
            {Object.values(ROLES).map((r) => (
              <option key={r.k} value={r.k}>
                {r.k} — {r.n}
              </option>
            ))}
          </select>
        </div>

        <div className="ctrl">
          <span>State</span>
          <select value={viewState} onChange={(e) => setViewState(e.target.value as ViewState)}>
            <option value="normal">Normal</option>
            <option value="loading">Loading</option>
            <option value="empty">Empty</option>
            <option value="error">Error</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        <div
          className="avatar"
          style={{ background: avatarBg }}
          title={`Signed in as ${ROLES[role]?.n}`}
        >
          {userInitial}
        </div>
      </div>
    </header>
  );
}
