'use client';

import { Select, Radio, Input, Button } from 'tdesign-react';
import { SearchIcon } from 'tdesign-icons-react';

interface FilterPanelProps {
  businesses: Array<{ id: string; name: string }>;
  scenes: Array<{ id: string; name: string }>;
  selectedBusiness: string;
  selectedScene: string;
  selectedStatus: string;
  searchKeyword: string;
  onBusinessChange: (value: string) => void;
  onSceneChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

export default function FilterPanel({
  businesses,
  scenes,
  selectedBusiness,
  selectedScene,
  selectedStatus,
  searchKeyword,
  onBusinessChange,
  onSceneChange,
  onStatusChange,
  onSearchChange,
  onReset,
}: FilterPanelProps) {
  const businessOptions = [
    { label: '全部', value: '' },
    ...businesses.map((b) => ({ label: b.name, value: b.id })),
  ];

  const sceneOptions = [
    { label: '全部', value: '' },
    ...scenes.map((s) => ({ label: s.name, value: s.id })),
  ];

  const statusOptions = [
    { label: '全部', value: '' },
    { label: '生效中', value: 'active' },
    { label: '处理中', value: 'processing' },
    { label: '失效', value: 'failed' },
  ];

  return (
    <div
      style={{
        width: '250px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        height: '100%',
      }}
    >
      {/* 业务类目 */}
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
          业务类目
        </div>
        <Select
          value={selectedBusiness}
          options={businessOptions}
          onChange={(value) => onBusinessChange(value as string)}
          style={{ width: '100%' }}
          clearable={false}
        />
      </div>

      {/* 场景 */}
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
          场景
        </div>
        <Select
          value={selectedScene}
          options={sceneOptions}
          onChange={(value) => onSceneChange(value as string)}
          style={{ width: '100%' }}
          clearable={false}
        />
      </div>

      {/* 状态 */}
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
          状态
        </div>
        <Radio.Group
          value={selectedStatus}
          onChange={(value) => onStatusChange(value as string)}
          style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}
        >
          {statusOptions.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      </div>

      {/* 关键字搜索 */}
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
          关键字搜索
        </div>
        <Input
          value={searchKeyword}
          onChange={(value) => onSearchChange(value)}
          placeholder="搜索文档..."
          clearable
          suffixIcon={<SearchIcon />}
          style={{ width: '100%' }}
        />
      </div>

      {/* 重置按钮 */}
      <Button
        onClick={onReset}
        theme="default"
        style={{
          width: '100%',
          marginTop: '8px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #d0d0d0',
        }}
      >
        重置筛选
      </Button>
    </div>
  );
}
