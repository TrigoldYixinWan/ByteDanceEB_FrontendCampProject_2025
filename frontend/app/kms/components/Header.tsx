'use client';

import { NotificationIcon, SettingIcon, UserIcon } from 'tdesign-icons-react';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = '商家知识库管理（KMS）' }: HeaderProps) {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}
    >
      <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#333' }}>{title}</h1>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            color: '#666',
            padding: '4px',
          }}
          title="通知"
        >
          <NotificationIcon />
        </button>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            color: '#666',
            padding: '4px',
          }}
          title="设置"
        >
          <SettingIcon />
        </button>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#1890ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '18px',
          }}
          title="用户"
        >
          <UserIcon />
        </div>
      </div>
    </header>
  );
}
