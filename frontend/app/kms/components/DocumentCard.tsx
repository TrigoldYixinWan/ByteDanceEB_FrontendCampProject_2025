'use client';

import { DeleteIcon, BrowseIcon, EditIcon } from 'tdesign-icons-react';
import type { Document } from '@project/shared';

interface DocumentCardProps {
  document: Document & {
    businessName?: string;
    sceneName?: string;
    source?: string;
  };
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function DocumentCard({ document, onView, onEdit, onDelete }: DocumentCardProps) {
  const getStatusStyle = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: '#e8f5e9', text: '#2e7d32', label: '生效中' },
      processing: { bg: '#fff9c4', text: '#f57f17', label: '处理中' },
      failed: { bg: '#eeeeee', text: '#616161', label: '失效' },
    };
    return statusMap[status] || statusMap.active;
  };

  const statusStyle = getStatusStyle(document.status);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'box-shadow 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = 'none';
      }}
    >
      {/* 标题行 */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '18px', color: '#1890ff' }}>📄</span>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#333', flex: 1 }}>
          {document.title}
        </h3>
      </div>

      {/* 信息行 */}
      <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
        <div>业务：{document.businessName || '-'}</div>
        <div>场景：{document.sceneName || '-'}</div>
        <div>来源：{document.source || 'PDF'}</div>
      </div>

      {/* 状态标签 */}
      <div
        style={{
          display: 'inline-block',
          backgroundColor: statusStyle.bg,
          color: statusStyle.text,
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600',
          width: 'fit-content',
        }}
      >
        {statusStyle.label}
      </div>

      {/* 操作按钮 */}
      <div
        style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid #f0f0f0' }}
      >
        <button
          onClick={() => onView?.(document.id)}
          style={{
            flex: 1,
            padding: '6px 12px',
            backgroundColor: '#e3f2fd',
            border: '1px solid #90caf9',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            color: '#1976d2',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <BrowseIcon size="16px" /> 查看
        </button>
        <button
          onClick={() => onEdit?.(document.id)}
          style={{
            flex: 1,
            padding: '6px 12px',
            backgroundColor: '#f3e5f5',
            border: '1px solid #ce93d8',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            color: '#7b1fa2',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <EditIcon size="16px" /> 编辑
        </button>
        <button
          onClick={() => onDelete?.(document.id)}
          style={{
            padding: '6px 12px',
            backgroundColor: '#ffebee',
            border: '1px solid #ef9a9a',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#d32f2f',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DeleteIcon size="16px" />
        </button>
      </div>
    </div>
  );
}
