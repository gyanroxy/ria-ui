'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

interface SaveBarProps {
  msg?: string;
  onSave?: () => void;
  disabled?: boolean;
}

export default function SaveBar({
  msg = 'Unsaved changes are kept locally until applied.',
  onSave,
  disabled = false,
}: SaveBarProps) {
  const { canAct, showToast } = useApp();
  const allowed = canAct('contacts') && !disabled;

  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      showToast('Settings saved and applied across running agents.');
    }
  };

  return (
    <div className="savebar">
      <span className="meta">{msg}</span>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          className="btn btn-ghost btn-sm"
          disabled={!allowed}
          onClick={() => showToast('Changes discarded.')}
        >
          Discard
        </button>
        <button className="btn btn-primary btn-sm" disabled={!allowed} onClick={handleSave}>
          Save changes
        </button>
      </div>
    </div>
  );
}
