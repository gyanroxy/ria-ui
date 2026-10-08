'use client';

import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import OfflineBanner from '../common/OfflineBanner';
import ViewOnlyNote from '../common/ViewOnlyNote';
import Toast from '../common/Toast';
import Modal from '../common/Modal';
import { SkeletonView, ErrorBoxView, NoPermView, EmptyStateView } from '../common/StateViews';
import { useApp } from '@/context/AppContext';
import { ScreenKey } from '@/types';

interface AppShellProps {
  screenKey: ScreenKey;
  children: ReactNode;
}

export default function AppShell({ screenKey, children }: AppShellProps) {
  const { viewState, perm } = useApp();
  const permission = perm(screenKey);

  return (
    <div className="shell">
      <Header />
      <Sidebar />
      <main className="main" id="main">
        <OfflineBanner />
        <ViewOnlyNote screenKey={screenKey} />

        {permission === 'X' ? (
          <NoPermView />
        ) : viewState === 'loading' ? (
          <SkeletonView />
        ) : viewState === 'error' ? (
          <ErrorBoxView />
        ) : viewState === 'empty' ? (
          <EmptyStateView screenKey={screenKey} />
        ) : (
          children
        )}
      </main>
      <Modal />
      <Toast />
    </div>
  );
}
