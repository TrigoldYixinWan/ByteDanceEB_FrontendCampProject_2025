'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './components/Header';
import Navigation from './components/Navigation';

export default function KmsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 根据当前路径确定激活的导航项
  let currentTab: 'dashboard' | 'business' | 'scenes' | 'documents' | 'status' | 'upload' =
    'status';

  if (pathname?.includes('/business')) {
    currentTab = 'business';
  } else if (pathname?.includes('/scenes')) {
    currentTab = 'scenes';
  } else if (pathname?.includes('/documents')) {
    currentTab = 'documents';
  } else if (pathname?.includes('/upload')) {
    currentTab = 'upload';
  } else if (pathname === '/kms' || pathname === '/kms/') {
    currentTab = 'status';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <Navigation currentTab={currentTab} />
      <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#f5f7fa' }}>{children}</div>
    </div>
  );
}
