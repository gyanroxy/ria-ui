import React from 'react';

export default function PriorityChip({ p }: { p: string }) {
  const cls = p === 'HIGH' ? 'c-red' : p === 'MED' ? 'c-gold' : 'c-blue';
  return <span className={`chip ${cls}`}>{p}</span>;
}
