'use client';

import Link from 'next/link';

interface NavigationProps {
  currentTab?: 'dashboard' | 'business' | 'scenes' | 'documents' | 'status' | 'upload';
}

export default function Navigation({ currentTab = 'status' }: NavigationProps) {
  const tabs = [
    { id: 'business', label: '业务管理', href: '/kms/business' },
    { id: 'scenes', label: '场景管理', href: '/kms/scenes' },
    { id: 'documents', label: '知识文档', href: '/kms/documents' },
    { id: 'status', label: '文档状态', href: '/kms' },
    { id: 'upload', label: '上传文档', href: '/kms/upload' },
  ];

  return (
    <nav
      style={{
        display: 'flex',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        paddingLeft: '20px',
      }}
    >
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          style={{
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            color: currentTab === tab.id ? '#1890ff' : '#666',
            textDecoration: 'none',
            borderBottom: currentTab === tab.id ? '3px solid #1890ff' : 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            bottom: currentTab === tab.id ? '1px' : '0',
          }}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
