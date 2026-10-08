import React from 'react';
import { TREND } from '@/data/mockData';

export default function CallsChart() {
  const maxVal = 260;
  const h = 130;
  const w = 520;
  const step = (w - 70) / (TREND.length - 1);

  const ptsPlaced = TREND.map((t, i) => `${45 + i * step},${150 - (t.placed / maxVal) * h}`).join(' ');
  const ptsConn = TREND.map((t, i) => `${45 + i * step},${150 - (t.conn / maxVal) * h}`).join(' ');
  const ptsPtp = TREND.map((t, i) => `${45 + i * step},${150 - (t.ptp / maxVal) * h}`).join(' ');

  return (
    <div>
      <svg className="chart" viewBox={`0 0 ${w} 180`} aria-label="Call volume trend chart">
        <line className="gl" x1="40" y1="20" x2={w - 10} y2="20" />
        <line className="gl" x1="40" y1="63" x2={w - 10} y2="63" />
        <line className="gl" x1="40" y1="106" x2={w - 10} y2="106" />
        <line className="gl" x1="40" y1="150" x2={w - 10} y2="150" />

        <text x="10" y="24">250</text>
        <text x="10" y="67">170</text>
        <text x="10" y="110">90</text>
        <text x="10" y="153">0</text>

        <polyline fill="none" stroke="var(--navy)" strokeWidth="2.5" points={ptsPlaced} />
        <polyline fill="none" stroke="var(--blue)" strokeWidth="2.5" points={ptsConn} />
        <polyline fill="none" stroke="var(--green)" strokeWidth="2.5" points={ptsPtp} />

        {TREND.map((t, i) => {
          const x = 45 + i * step;
          const yPlaced = 150 - (t.placed / maxVal) * h;
          const yConn = 150 - (t.conn / maxVal) * h;
          const yPtp = 150 - (t.ptp / maxVal) * h;
          return (
            <g key={i}>
              <circle cx={x} cy={yPlaced} r="3.5" fill="var(--navy)" />
              <circle cx={x} cy={yConn} r="3.5" fill="var(--blue)" />
              <circle cx={x} cy={yPtp} r="3.5" fill="var(--green)" />
              <text x={x} y="170" textAnchor="middle">
                {t.d}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="legend">
        <span>
          <i style={{ background: 'var(--navy)' }} /> Placed (1,220 total)
        </span>
        <span>
          <i style={{ background: 'var(--blue)' }} /> Connected (1,032 · 84.6%)
        </span>
        <span>
          <i style={{ background: 'var(--green)' }} /> PTP commitments (693 · 67.1%)
        </span>
      </div>
    </div>
  );
}
