'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ROLES } from '@/data/mockData';
import { RoleKey } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { setRole, login, showToast } = useApp();
  const [user, setUser] = useState('vishal@roxyindustries.in');
  const [pass, setPass] = useState('••••••••••');
  const [tenant, setTenant] = useState('Roxy Distributors LLP — Hyderabad');
  const [selectedRole, setSelectedRole] = useState<RoleKey>('OW');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !pass) {
      setError(true);
      return;
    }
    setRole(selectedRole);
    login(user, pass);
    router.push('/dashboard');
  };

  return (
    <div id="login" className="login">
      <div className="login-art">
        <div className="art-badge">▲ Roxy Industries Pvt. Ltd. · Phase 1</div>
        <div>
          <h1>The screen tells you what to do, and why.</h1>
          <p>
            RIA prioritises every retailer account, calls in the retailer&apos;s own language, captures the outcome as evidence, and hands you the decision that needs a human.
          </p>
        </div>
        <div className="art-stats">
          <div>
            <span className="n">5,600</span>
            <span className="l">calls / month modelled</span>
          </div>
          <div>
            <span className="n">3.8 min</span>
            <span className="l">blended call duration</span>
          </div>
          <div>
            <span className="n">100%</span>
            <span className="l">calls recorded &amp; logged</span>
          </div>
        </div>
      </div>

      <div className="login-form">
        <div className="login-box">
          <div style={{ marginBottom: '26px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '.14em', color: 'var(--navy)' }}>
                RIA
              </span>
              <span style={{ fontSize: '10px', letterSpacing: '.1em', color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>
                Distribution Intelligence
              </span>
            </div>
          </div>

          <h2>Sign in to RIA</h2>
          <p className="sub">Use your distributor account. Administrative roles also need a one-time code.</p>

          {error && (
            <div className="msg msg-err">
              <span>⚠️</span>
              <span>Those credentials did not work. Check and try again.</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="lgUser">Email or mobile</label>
              <input
                id="lgUser"
                type="text"
                value={user}
                onChange={(e) => {
                  setUser(e.target.value);
                  setError(false);
                }}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="lgPass">Password</label>
              <input
                id="lgPass"
                type="password"
                value={pass}
                onChange={(e) => {
                  setPass(e.target.value);
                  setError(false);
                }}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="lgTenant">Tenant</label>
              <select id="lgTenant" value={tenant} onChange={(e) => setTenant(e.target.value)}>
                <option>Roxy Distributors LLP — Hyderabad</option>
                <option>MAK Distributors — Saidabad</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="lgRole">Sign in as (prototype role switch)</label>
              <select
                id="lgRole"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as RoleKey)}
              >
                {Object.values(ROLES).map((r) => (
                  <option key={r.k} value={r.k}>
                    {r.k} — {r.n}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Sign in
            </button>
          </form>

          <div className="login-foot">
            <a
              className="link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                showToast('A reset link would be sent to the registered address.');
              }}
            >
              Forgot password
            </a>
            <span>Attempts are rate limited and audit logged.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
