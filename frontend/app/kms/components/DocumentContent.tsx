'use client';

import { Button } from 'tdesign-react';
import { ViewColumnIcon, ViewListIcon } from 'tdesign-icons-react';
import DocumentCard from './DocumentCard';
import DocumentTable from './DocumentTable';
import type { Document } from '@project/shared';

interface DocumentContentProps {
  documents: Array<
    Document & {
      businessName?: string;
      sceneName?: string;
      source?: string;
    }
  >;
  viewMode: 'card' | 'table';
  onViewModeChange: (mode: 'card' | 'table') => void;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

export default function DocumentContent({
  documents,
  viewMode,
  onViewModeChange,
  onView,
  onEdit,
  onDelete,
  isLoading,
}: DocumentContentProps) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        backgroundColor: '#ffffff',
        overflow: 'auto',
      }}
    >
      {/* 顶部视图切换 */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Button
          onClick={() => onViewModeChange('card')}
          theme={viewMode === 'card' ? 'primary' : 'default'}
          size="small"
          icon={<ViewColumnIcon />}
        >
          卡片视图
        </Button>
        <Button
          onClick={() => onViewModeChange('table')}
          theme={viewMode === 'table' ? 'primary' : 'default'}
          size="small"
          icon={<ViewListIcon />}
        >
          表格视图
        </Button>
      </div>

      {/* 加载状态 */}
      {isLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            color: '#999',
          }}
        >
          加载中...
        </div>
      )}

      {/* 空状态 */}
      {!isLoading && documents.length === 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            color: '#999',
          }}
        >
          暂无数据
        </div>
      )}

      {/* 卡片视图 */}
      {!isLoading && documents.length > 0 && viewMode === 'card' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* 表格视图 */}
      {!isLoading && documents.length > 0 && viewMode === 'table' && (
        <DocumentTable documents={documents} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      )}
    </div>
  );
}
