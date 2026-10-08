'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { downloadCSV } from '@/utils/formatters';
import { CampaignContact, CallItem } from '@/types';
import AddContactModalContent from './AddContactModal';

export default function ContactsTable() {
  const { campaignContacts, addCampaignContact, addCalls, openModal, closeModal, showToast, canAct } = useApp();
  const allowed = canAct('contacts');
  const [search, setSearch] = useState('');
  const [creditFilter, setCreditFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = campaignContacts.filter((c) => {
    if (creditFilter !== 'ALL' && c.creditPeriod !== creditFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.phno.includes(q)) return false;
    }
    return true;
  });

  const handleToggleSelect = (c: CampaignContact) => {
    const isCurrentlySelected = selectedIds.has(c.id);
    const next = new Set(selectedIds);

    if (isCurrentlySelected) {
      next.delete(c.id);
      setSelectedIds(next);
      showToast(`Deselected ${c.name}`);
    } else {
      next.add(c.id);
      setSelectedIds(next);
      showToast(`✓ Added ${c.name} to active campaign queue`);

      const newCall: CallItem = {
        id: `CL-${Math.floor(1000 + Math.random() * 9000)}`,
        ret: c.id,
        name: c.name,
        ph: c.phno,
        time: 'Queued',
        lang: 'Telugu',
        dur: '—',
        disp: 'Queued for dialing',
        ptp: '—',
        auto: 'L2',
        audio: 'rec-queued.wav',
        score: 85,
        turns: [
          { who: 'RIA', lang: 'te', txt: `నమస్కారం ${c.name} గారూ! రాక్సీ డిస్ట్రిబ్యూటర్స్ నుంచి ఆర్ఐఏ (RIA) ని మాట్లాడుతున్నాను.` }
        ],
      };
      addCalls([newCall]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
      showToast('Deselected all contacts');
    } else {
      const allIds = new Set(filtered.map((c) => c.id));
      setSelectedIds(allIds);
      showToast(`✓ Selected all ${filtered.length} contacts for campaign`);
    }
  };

  const handleOpenAddModal = () => {
    openModal(
      'Add Customer to Campaign List',
      <AddContactModalContent
        onClose={closeModal}
        onSave={(newC) => addCampaignContact(newC)}
      />
    );
  };

  const handleExportCSV = () => {
    const rows = [
      ['Name', 'Phone Number', 'Credit Period', 'Added Date'],
      ...campaignContacts.map((c) => [c.name, c.phno, c.creditPeriod, c.addedAt || '2026-04-14']),
    ];
    downloadCSV('ria_campaign_contacts.csv', rows);
    showToast('Exported ria_campaign_contacts.csv');
  };

  return (
    <div className="card">
      <div className="card-h">
        <div>
          <h3>Campaign Customer Directory</h3>
          <span className="sub">
            All customer accounts added to automated telecalling campaigns ({campaignContacts.length} total)
          </span>
        </div>
        <div className="r">
          {selectedIds.size > 0 && (
            <span className="chip c-green" style={{ fontSize: '12px' }}>
              {selectedIds.size} Selected for Campaign
            </span>
          )}
          <button className="btn btn-ghost btn-sm" onClick={handleExportCSV}>
            Export CSV
          </button>
          {allowed && (
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddModal}>
              + Add Contact
            </button>
          )}
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Filter by customer name or phone number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '300px', padding: '6px 10px', fontSize: '13px' }}
        />

        <select value={creditFilter} onChange={(e) => setCreditFilter(e.target.value)}>
          <option value="ALL">All Credit Periods</option>
          <option value="7 Days">7 Days</option>
          <option value="15 Days">15 Days</option>
          <option value="21 Days">21 Days</option>
          <option value="30 Days">30 Days</option>
          <option value="45 Days">45 Days</option>
          <option value="60 Days">60 Days</option>
          <option value="90 Days">90 Days</option>
          <option value="Immediate / COD">Immediate / COD</option>
        </select>

        <button className="btn btn-ghost btn-sm" onClick={handleSelectAll}>
          {selectedIds.size === filtered.length && filtered.length > 0 ? 'Deselect All' : 'Select All'}
        </button>

        <div className="sp">
          <span>
            Showing <b>{filtered.length}</b> of <b>{campaignContacts.length}</b> contacts
          </span>
        </div>
      </div>

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: '38%' }}>Name</th>
              <th style={{ width: '26%' }}>Phone Number (phno)</th>
              <th style={{ width: '18%' }}>Credit Period</th>
              <th style={{ width: '18%', textAlign: 'right' }}>Select / Add</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--t3)' }}>
                  No customer contacts match your filter.
                </td>
              </tr>
            ) : (
              filtered.map((c) => {
                const isSelected = selectedIds.has(c.id);

                return (
                  <tr
                    key={c.id}
                    className={isSelected ? 'sel' : ''}
                    onClick={() => handleToggleSelect(c)}
                  >
                    <td>
                      <div className="name" style={{ fontSize: '14px' }}>{c.name}</div>
                    </td>
                    <td className="mono" style={{ fontSize: '13.5px', color: 'var(--navy)', fontWeight: 600 }}>
                      {c.phno}
                    </td>
                    <td>
                      <span className="chip c-blue" style={{ fontSize: '12px', padding: '4px 10px' }}>
                        {c.creditPeriod}
                      </span>
                    </td>
                    <td className="right">
                      <button
                        type="button"
                        className={`btn btn-sm ${isSelected ? 'btn-green' : 'btn-ghost'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSelect(c);
                        }}
                      >
                        {isSelected ? '✓ Added' : '+ Add / Select'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
