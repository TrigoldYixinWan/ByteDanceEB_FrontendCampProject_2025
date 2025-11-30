'use client';

import { Table } from 'tdesign-react';
import { DeleteIcon, BrowseIcon, EditIcon } from 'tdesign-icons-react';
import type { Document } from '@project/shared';
import type { PrimaryTableCol, PrimaryTableCellParams } from 'tdesign-react';

// 定义表格行数据类型
interface DocumentRowData extends Document {
  businessName?: string;
  sceneName?: string;
  source?: string;
}

// 使用 TDesign 的标准表格单元格参数类型，扩展为我们的文档行数据类型
interface TableCellParams extends PrimaryTableCellParams<DocumentRowData> {}

interface DocumentTableProps {
  documents: DocumentRowData[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function DocumentTable({ documents, onView, onEdit, onDelete }: DocumentTableProps) {
  const getStatusStyle = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: '#e8f5e9', text: '#2e7d32', label: '生效中' },
      processing: { bg: '#fff9c4', text: '#f57f17', label: '处理中' },
      failed: { bg: '#eeeeee', text: '#616161', label: '失效' },
    };
    return statusMap[status] || statusMap.active;
  };

  const columns: PrimaryTableCol<DocumentRowData>[] = [
    {
      colKey: 'title',
      title: '文档标题',
      width: 200,
      ellipsis: true,
      cell: (h: TableCellParams) => (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span>📄</span>
          <span>{h.row.title}</span>
        </div>
      ),
    },
    {
      colKey: 'businessName',
      title: '业务',
      width: 120,
      ellipsis: true,
    },
    {
      colKey: 'sceneName',
      title: '场景',
      width: 120,
      ellipsis: true,
    },
    {
      colKey: 'source',
      title: '来源',
      width: 100,
    },
    {
      colKey: 'status',
      title: '状态',
      width: 100,
      cell: (h: TableCellParams) => {
        const statusStyle = getStatusStyle(h.row.status);
        return (
          <div
            style={{
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            {statusStyle.label}
          </div>
        );
      },
    },
    {
      colKey: 'actions',
      title: '操作',
      width: 150,
      align: 'center' as const,
      cell: (h: TableCellParams) => (
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
          <button
            onClick={() => onView?.(h.row.id)}
            style={{
              padding: '4px 8px',
              backgroundColor: '#e3f2fd',
              border: '1px solid #90caf9',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#1976d2',
            }}
            title="查看"
          >
            <BrowseIcon size="16px" />
          </button>
          <button
            onClick={() => onEdit?.(h.row.id)}
            style={{
              padding: '4px 8px',
              backgroundColor: '#f3e5f5',
              border: '1px solid #ce93d8',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#7b1fa2',
            }}
            title="编辑"
          >
            <EditIcon size="16px" />
          </button>
          <button
            onClick={() => onDelete?.(h.row.id)}
            style={{
              padding: '4px 8px',
              backgroundColor: '#ffebee',
              border: '1px solid #ef9a9a',
              borderRadius: '4px',
              cursor: 'pointer',
              color: '#d32f2f',
              fontSize: '12px',
            }}
            title="删除"
          >
            <DeleteIcon size="16px" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={documents}
      rowKey="id"
      style={{ backgroundColor: '#ffffff' }}
      hover
    />
  );
}
