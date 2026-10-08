import React from 'react';
import { RECOVERY } from '@/data/mockData';
import { lakh } from '@/utils/formatters';

export default function RecoveryChart() {
  const maxVal = 6000000;
  const h = 130;
  const w = 520;
  const step = (w - 70) / RECOVERY.length;

  return (
    <div>
      <svg className="chart" viewBox={`0 0 ${w} 180`} aria-label="Overdue demand vs recovery trend chart">
        <line className="gl" x1="45" y1="20" x2={w - 10} y2="20" />
        <line className="gl" x1="45" y1="63" x2={w - 10} y2="63" />
        <line className="gl" x1="45" y1="106" x2={w - 10} y2="106" />
        <line className="gl" x1="45" y1="150" x2={w - 10} y2="150" />

        <text x="10" y="24">₹60L</text>
        <text x="10" y="67">₹40L</text>
        <text x="10" y="110">₹20L</text>
        <text x="10" y="153">0</text>

        {RECOVERY.map((r, i) => {
          const x0 = 55 + i * step;
          const hDem = (r.dem / maxVal) * h;
          const hRec = (r.rec / maxVal) * h;
          return (
            <g key={i}>
              <rect x={x0} y={150 - hDem} width="28" height={hDem} rx="4" fill="#EEF1F8" />
              <rect x={x0 + 6} y={150 - hRec} width="16" height={hRec} rx="3" fill="var(--green)" />
              <text x={x0 + 14} y="170" textAnchor="middle">
                {r.d}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="legend">
        <span>
          <i style={{ background: '#DCE4F0' }} /> Demand target ({lakh(24200000)})
        </span>
        <span>
          <i style={{ background: 'var(--green)' }} /> Actual recovered ({lakh(18570000)})
        </span>
      </div>
    </div>
  );
}
