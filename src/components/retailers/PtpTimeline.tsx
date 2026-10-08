import React from 'react';

export default function PtpTimeline({
  history,
}: {
  history?: Array<{ d: string; typ: string; dur: string; disp: string; rec: string }>;
}) {
  const defaultEvents = [
    { when: 'Today 10:42 AM', what: 'Call CL-4416 (Telugu · 3m 42s)', det: 'PTP given: ₹1,00,000 committed for April 18 via RTGS. WhatsApp link requested.', cls: 'pay' },
    { when: '2026-04-04 11:15 AM', what: 'Call CL-4102 (Telugu · 1m 18s)', det: 'Call not lifted (attempt 2). Automated SMS notification sent.', cls: 'ptp' },
    { when: '2026-03-28 04:20 PM', what: 'Call CL-3891 (Telugu · 4m 05s)', det: 'Dispute raised on damaged goods for INV-0891. Ticket TK-1064 resolved.', cls: 'esc' },
    { when: '2026-03-15 02:10 PM', what: 'Payment Received — ₹65,000', det: 'UTR: HDFC0001928371 — Matched to invoice INV-2026-0774.', cls: 'pay' },
  ];

  return (
    <div className="card">
      <div className="card-h">
        <h3>Touchpoint & PTP Timeline</h3>
        <span className="sub">Chronological audit trail of all interactions</span>
      </div>
      <div className="card-b">
        <div className="timeline">
          {defaultEvents.map((e, idx) => (
            <div key={idx} className={`tl ${e.cls}`}>
              <div className="when">{e.when}</div>
              <div className="what">{e.what}</div>
              <div className="det">{e.det}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
