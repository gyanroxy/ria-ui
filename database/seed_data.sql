-- ============================================================================
-- RIA Telecalling Agent — Production Seed Data
-- ============================================================================

-- 1. Tenant
INSERT INTO tenants (id, name, gstin, caller_id)
VALUES (
    'TENANT-001',
    'Roxy Distributors LLP',
    '36AABCR1234F1Z8',
    'ROXY-HYD'
) ON CONFLICT (id) DO NOTHING;

-- 2. Users
INSERT INTO users (id, tenant_id, name, email, password_hash, role, phone, status)
VALUES
('U1', 'TENANT-001', 'Vishal T.', 'vishal@roxyindustries.in', crypt('admin123', gen_salt('bf')), 'OW', '+91 98490 10001', 'Active'),
('U2', 'TENANT-001', 'Suresh Raina', 'suresh.r@roxyindustries.in', crypt('admin123', gen_salt('bf')), 'CM', '+91 98490 10002', 'Active'),
('U3', 'TENANT-001', 'Pooja Hegde', 'pooja.h@roxyindustries.in', crypt('admin123', gen_salt('bf')), 'CE', '+91 98490 10003', 'Active'),
('U4', 'TENANT-001', 'Ramesh Kumar', 'ramesh.k@roxyindustries.in', crypt('admin123', gen_salt('bf')), 'AC', '+91 98490 10004', 'Active'),
('U5', 'TENANT-001', 'K. S. Rao & Co.', 'audit@ksraoco.in', crypt('admin123', gen_salt('bf')), 'PA', '+91 98490 10005', 'Active'),
('U6', 'TENANT-001', 'Admin Team', 'admin@roxyindustries.in', crypt('admin123', gen_salt('bf')), 'TA', '+91 98490 10006', 'Active')
ON CONFLICT (id) DO NOTHING;

-- 3. Retailers
INSERT INTO retailers (id, tenant_id, code, name, owner_name, business_name, phone, city, preferred_lang, aging_bucket, total_outstanding, overdue_amount, credit_limit, credit_period, last_call_at, last_ptp_date, last_disposition, sentiment_score, autonomy_level)
VALUES
('R1', 'TENANT-001', 'RET-0481', 'Sri Balaji Kirana & General Store', 'Venkatesh Rao', 'Sri Balaji Kirana & General Store', '+91 98490 22114', 'Hyderabad', 'Telugu', '31-60d', 245000.00, 180000.00, 300000.00, '30 Days', '2026-04-14 10:42:00+05:30', '2026-04-18', 'PTP given', 88, 'L2'),
('R2', 'TENANT-001', 'RET-1102', 'Lakshmi Super Bazar', 'Lakshmi Narayana', 'Lakshmi Super Bazar', '+91 97001 88342', 'Hyderabad', 'Telugu', '61-90d', 380000.00, 380000.00, 400000.00, '45 Days', '2026-04-14 10:15:00+05:30', NULL, 'Call not lifted (1 attempts)', 70, 'L2'),
('R3', 'TENANT-001', 'RET-0914', 'Ganesh Provision Store', 'Ganesh Kumar', 'Ganesh Provision Store', '+91 94400 12789', 'Hyderabad', 'Telugu', '1-30d', 95000.00, 45000.00, 150000.00, '30 Days', '2026-04-14 09:30:00+05:30', '2026-04-15', 'PTP given', 92, 'L2'),
('R4', 'TENANT-001', 'RET-1420', 'Shree Krishna Traders', 'Ramesh Gupta', 'Shree Krishna Traders', '+91 98850 66321', 'Secunderabad', 'Hindi', '>90d', 520000.00, 520000.00, 500000.00, '60 Days', '2026-04-14 11:00:00+05:30', '2026-04-08', 'Broken promise (2x)', 25, 'L0'),
('R5', 'TENANT-001', 'RET-0331', 'New Bharat Medical & General', 'Bharat Shah', 'New Bharat Medical & General', '+91 99123 45670', 'Hyderabad', 'Telugu', '1-30d', 140000.00, 140000.00, 200000.00, '30 Days', '2026-04-14 09:45:00+05:30', '2026-04-16', 'PTP given', 85, 'L2'),
('R6', 'TENANT-001', 'RET-1804', 'Durga Bhavani Stores', 'Durga Prasad', 'Durga Bhavani Stores', '+91 96521 90812', 'Hyderabad', 'Telugu', '31-60d', 185000.00, 185000.00, 250000.00, '30 Days', '2026-04-14 11:20:00+05:30', NULL, 'Call not lifted (3 attempts)', 40, 'L1'),
('R7', 'TENANT-001', 'RET-2011', 'Venkateshwara Super Market', 'Srinivas V.', 'Venkateshwara Super Market', '+91 98491 55432', 'Hyderabad', 'Telugu', '1-30d', 120000.00, 75000.00, 200000.00, '30 Days', '2026-04-12 11:00:00+05:30', '2026-04-12', 'PTP given (Kept)', 95, 'L2'),
('R8', 'TENANT-001', 'RET-3044', 'Balaji Agencies & Stores', 'Balaji S.', 'Balaji Agencies & Stores', '+91 98490 88219', 'Hyderabad', 'Telugu', '1-30d', 90000.00, 90000.00, 150000.00, '30 Days', '2026-04-14 09:10:00+05:30', NULL, 'Call not lifted (2 attempts)', 65, 'L2')
ON CONFLICT (id) DO NOTHING;

-- 4. Invoices
INSERT INTO invoices (retailer_id, invoice_number, amount, due_amount, due_date, status)
VALUES
('R1', 'INV-0891', 120000.00, 100000.00, '2026-04-15', 'unpaid'),
('R1', 'INV-0944', 125000.00, 80000.00, '2026-04-30', 'unpaid'),
('R2', 'INV-0774', 210000.00, 210000.00, '2026-03-25', 'disputed'),
('R2', 'INV-0820', 170000.00, 170000.00, '2026-04-05', 'unpaid'),
('R4', 'INV-0650', 300000.00, 300000.00, '2026-03-01', 'unpaid'),
('R4', 'INV-0710', 220000.00, 220000.00, '2026-03-18', 'unpaid')
ON CONFLICT DO NOTHING;

-- 5. Call Batches
INSERT INTO call_batches (id, tenant_id, name, imported_by_name, file_name, total_calls, completed_calls, connected_calls, ptp_count, ptp_amount, dispute_count, no_lift_count, status, created_at)
VALUES
('BATCH-2026-04-14-A', 'TENANT-001', 'Daily Morning Collection Run (Hyderabad Central)', 'Vishal T.', 'calls_2026_04_14.csv', 240, 238, 205, 142, 1850000.00, 18, 38, 'Completed', '2026-04-14 08:30:00+05:30'),
('BATCH-2026-04-13-A', 'TENANT-001', 'Overdue >60d Evening Follow-up', 'Vishal T.', 'calls_2026_04_13.csv', 225, 225, 190, 128, 1620000.00, 12, 32, 'Completed', '2026-04-13 16:00:00+05:30'),
('BATCH-2026-04-12-B', 'TENANT-001', 'Secunderabad & Saidabad Priority Run', 'Suresh Raina', 'calls_2026_04_12.csv', 210, 210, 178, 112, 1480000.00, 15, 28, 'Completed', '2026-04-12 11:15:00+05:30')
ON CONFLICT (id) DO NOTHING;

-- 6. Calls & Bilingual Turns
INSERT INTO calls (id, batch_id, retailer_id, customer_name, phone, language, duration_seconds, duration_display, disposition, ptp_committed_date, ptp_amount, sentiment_score, autonomy_level, audio_recording_url, turns, created_at)
VALUES
(
    'CL-4416',
    'BATCH-2026-04-14-A',
    'R1',
    'Sri Balaji Kirana & General Store',
    '+91 98490 22114',
    'Telugu',
    222,
    '3m 42s',
    'PTP given',
    '2026-04-18',
    100000.00,
    88,
    'L2',
    'https://storage.googleapis.com/ria-recordings-prod/rec-4416.wav',
    '[
        {"who": "RIA", "lang": "te", "txt": "నమస్కారం వెంకటేశ్ గారూ! నేను రాక్సీ డిస్ట్రిబ్యూటర్స్ నుంచి ఆర్ఐఏ (RIA) ని మాట్లాడుతున్నాను. బాగున్నారా?"},
        {"who": "Retailer", "lang": "te", "txt": "నమస్తే అండీ. బాగున్నాను. చెప్పండి."},
        {"who": "RIA", "lang": "te", "txt": "వెంకటేశ్ గారూ, మీ ఖాతాలో ₹1,80,000 బాకీ ఉంది. ఇన్వాయిస్ 0891 మరియు 0944 గత నెల 15 మరియు 31 నాటివి. వీటి చెల్లింపు ఎప్పుడు చేయగలరు?"},
        {"who": "Retailer", "lang": "te", "txt": "ఈ వారం కొద్దిగా కలెక్షన్స్ నెమ్మదిగా ఉన్నాయి. శనివారం (ఏప్రిల్ 18) ఒక లక్ష రూపాయలు ఆర్టీజీఎస్ (RTGS) చేస్తాను. మిగిలిన ₹80,000 వచ్చే వారం క్లియర్ చేస్తాను."},
        {"who": "RIA", "lang": "te", "txt": "ధన్యవాదాలు వెంకటేశ్ గారూ. శనివారం ఏప్రిల్ 18 న ₹1,00,000 చెల్లింపు నమోదు చేసుకున్నాను. చెల్లింపు లింక్ మీ వాట్సాప్ కి పంపించమంటారా?"},
        {"who": "Retailer", "lang": "te", "txt": "అవును, వాట్సాప్ చేయండి, నేను చూసుకుంటాను."},
        {"who": "RIA", "lang": "te", "txt": "ఖచ్చితంగా పంపుతున్నాను. మీ సహకారానికి ధన్యవాదాలు. రోక్సీతో మీ వ్యాపారం శుభప్రదం కావాలని కోరుకుంటున్నాము. నమస్కారం!"}
    ]'::jsonb,
    '2026-04-14 10:42:00+05:30'
),
(
    'CL-4417',
    'BATCH-2026-04-14-A',
    'R2',
    'Lakshmi Super Bazar',
    '+91 97001 88342',
    'Telugu',
    0,
    '0m 0s',
    'Call not lifted',
    NULL,
    NULL,
    70,
    'L2',
    NULL,
    '[]'::jsonb,
    '2026-04-14 10:15:00+05:30'
)
ON CONFLICT (id, created_at) DO NOTHING;

-- 7. Autonomous Reschedule & Fast 5-Min Callback Queue
INSERT INTO call_reschedule_queue (id, tenant_id, retailer_id, batch_id, source_call_id, customer_name, phone, outstanding_amount, type, priority, scheduled_for, attempt_number, max_attempts, ai_note, last_outcome, status)
VALUES
('SCH-101', 'TENANT-001', 'R1', 'BATCH-2026-04-14-A', 'CL-4416', 'Sri Balaji Kirana & General Store', '+91 98490 22114', 180000.00, 'customer_requested', 'High', CURRENT_TIMESTAMP + INTERVAL '24 minutes', 1, 3, 'Retailer was attending store customers. Stated: "Call after 4 PM, I will arrange RTGS."', 'Customer requested 4:30 PM callback', 'Queued'),
('SCH-102', 'TENANT-001', 'R2', 'BATCH-2026-04-14-A', 'CL-4417', 'Lakshmi Super Bazar', '+91 97001 88342', 380000.00, 'no_lift_retry', 'High', CURRENT_TIMESTAMP + INTERVAL '5 minutes', 2, 3, 'Ringing No Answer at 10:15 AM. Autonomous quick-retry scheduled in 5 mins.', 'No Lift (Attempt #1)', 'Queued'),
('SCH-103', 'TENANT-001', 'R4', 'BATCH-2026-04-14-A', 'CL-4419', 'Shree Krishna Traders', '+91 98850 66321', 520000.00, 'customer_requested', 'High', CURRENT_TIMESTAMP + INTERVAL '2 hours', 1, 3, 'Spoke with cashier. Owner Ramesh Ji in bank, asked RIA to call after 5 PM.', 'Owner unavailable, callback requested', 'Queued'),
('SCH-104', 'TENANT-001', 'R6', 'BATCH-2026-04-14-A', 'CL-4421', 'Durga Bhavani Stores', '+91 96521 90812', 185000.00, 'no_lift_retry', 'Medium', CURRENT_TIMESTAMP + INTERVAL '5 minutes', 1, 3, 'Line busy / Not answered at 11:20 AM. Autonomous fast-retry scheduled in 5 mins.', 'Line Busy (Attempt #1)', 'Queued'),
('SCH-106', 'TENANT-001', 'R4', 'BATCH-2026-04-14-A', 'CL-4402', 'Sri Sai Motors', '+91 98850 77112', 310000.00, 'no_lift_retry', 'High', CURRENT_TIMESTAMP, 3, 3, '3 consecutive attempts (Morning, Afternoon, Evening) went unanswered. Recommending physical field visit.', 'Max retries exceeded (3 attempts)', 'Exhausted')
ON CONFLICT (id) DO NOTHING;

-- 8. PTP Commitments
INSERT INTO ptp_commitments (id, retailer_id, source_call_id, customer_name, phone, amount, due_date, status, autonomy_level, payment_link_sent, payment_link_url)
VALUES
('PTP-101', 'R1', 'CL-4416', 'Sri Balaji Kirana & General Store', '+91 98490 22114', 100000.00, '2026-04-18', 'upcoming', 'L2', TRUE, 'https://pay.roxyindustries.in/r/0891-ptp'),
('PTP-102', 'R3', 'CL-4410', 'Ganesh Provision Store', '+91 94400 12789', 45000.00, '2026-04-15', 'due', 'L2', TRUE, 'https://pay.roxyindustries.in/r/0914-ptp'),
('PTP-103', 'R5', 'CL-4408', 'New Bharat Medical & General', '+91 99123 45670', 140000.00, '2026-04-16', 'upcoming', 'L2', FALSE, NULL),
('PTP-104', 'R4', 'CL-4402', 'Shree Krishna Traders', '+91 98850 66321', 250000.00, '2026-04-08', 'broken', 'L0', FALSE, NULL),
('PTP-105', 'R7', 'CL-4395', 'Venkateshwara Super Market', '+91 98491 55432', 75000.00, '2026-04-12', 'kept', 'L2', TRUE, 'https://pay.roxyindustries.in/r/0812-ptp')
ON CONFLICT (id) DO NOTHING;

-- 9. Tickets & Escalations
INSERT INTO tickets (id, tenant_id, retailer_id, source_call_id, customer_name, category, severity, assigned_to_name, status, resolution_note)
VALUES
('E-311', 'TENANT-001', 'R2', 'CL-4390', 'Venkateswara Traders', 'Dispute raised', 'High', 'Unassigned', 'Open', NULL),
('E-310', 'TENANT-001', 'R2', 'CL-4414', 'RK Motors', 'Already-paid claim', 'Medium', 'Accounts — Priya', 'Open', NULL),
('E-309', 'TENANT-001', 'R6', 'CL-4415', 'MAK Spares', 'Low model confidence', 'Medium', 'CM — Ramesh', 'Open', NULL),
('E-308', 'TENANT-001', 'R4', 'CL-4402', 'Sri Sai Motors', 'Repeated broken promise', 'High', 'CM — Ramesh', 'Open', NULL)
ON CONFLICT (id) DO NOTHING;

-- 10. Customer Care Contacts
INSERT INTO customer_care_contacts (tenant_id, name, role_title, phone, email, available_hours, sort_order)
VALUES
('TENANT-001', 'Credit Helpdesk (Direct)', 'Escalations & Disputes', '+91 40 2450 1100', 'credit@roxyindustries.in', '9:30 AM – 6:30 PM (Mon–Sat)', 1),
('TENANT-001', 'Suresh Raina', 'Credit Manager', '+91 98490 10002', 'suresh.r@roxyindustries.in', 'Direct review & approvals', 2),
('TENANT-001', 'WhatsApp Support', 'Automated + Human Assist', '+91 98490 10099', '—', '24x7 bot + 9 AM–7 PM human', 3),
('TENANT-001', 'Accountant (Ledger)', 'Payments & UTR reconciliation', '+91 40 2450 1104', 'accounts@roxyindustries.in', '10:00 AM – 6:00 PM', 4)
ON CONFLICT DO NOTHING;

-- 11. Campaign Contacts
INSERT INTO campaign_contacts (id, tenant_id, name, phone, credit_period)
VALUES
('C1', 'TENANT-001', 'Venkatesh Rao — Sri Balaji Kirana', '+91 98490 22114', '30 Days'),
('C2', 'TENANT-001', 'Lakshmi Narayana — Lakshmi Super Bazar', '+91 97001 88342', '45 Days'),
('C3', 'TENANT-001', 'Ganesh Kumar — Ganesh Provision Store', '+91 94400 12789', '30 Days'),
('C4', 'TENANT-001', 'Ramesh Gupta — Shree Krishna Traders', '+91 98850 66321', '60 Days')
ON CONFLICT (id) DO NOTHING;
