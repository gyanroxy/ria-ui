'use client';

import React, { ReactNode } from 'react';
import { ScreenKey } from '@/types';
import { TITLES } from '@/data/mockData';

interface PageHeadProps {
  screenKey: ScreenKey;
  rightAction?: ReactNode;
  isStale?: boolean;
}

export default function PageHead({ screenKey, rightAction, isStale }: PageHeadProps) {
  const t = TITLES[screenKey] || ['RIA', 'Page', ''];
  const showStale = isStale ?? (screenKey === 'collections' || screenKey === 'dashboard');

  return (
    <div className="page-head">
      <div>
        <div className="eyebrow">{t[0]}</div>
        <h1>{t[1]}</h1>
        <p>{t[2]}</p>
      </div>
      <div className="head-right">
        {showStale && (
          <span className="stale" title="ERP sync cadence is 15 minutes">
            ⚡ Synced 4m ago
          </span>
        )}
        {rightAction}
      </div>
    </div>
  );
}
