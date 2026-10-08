import React from 'react';
import { lakh } from '@/utils/formatters';

export default function RecoverySummary() {
  return (
    <div className="grid g4" style={{ marginBottom: '14px' }}>
      <div className="tile navy">
        <div className="n">{lakh(24200000)}</div>
        <div className="l">Total Overdue Demand</div>
        <div className="d">Across 480 active retailer accounts</div>
      </div>
      <div className="tile teal">
        <div className="n">{lakh(18570000)}</div>
        <div className="l">Total Recovered (MTD)</div>
        <div className="d">Directly attributed to RIA calls</div>
      </div>
      <div className="tile">
        <div className="n">76.8%</div>
        <div className="l">Recovery Rate</div>
        <div className="d">Target baseline: 65% for Phase 1</div>
      </div>
      <div className="tile gold">
        <div className="n">{lakh(26500000)}</div>
        <div className="l">Projected Month-End</div>
        <div className="d">Based on PTP commitments in pipeline</div>
      </div>
    </div>
  );
}
