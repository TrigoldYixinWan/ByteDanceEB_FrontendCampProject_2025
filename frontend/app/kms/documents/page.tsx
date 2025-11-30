'use client';

import { useState, useEffect } from 'react';
import { MessagePlugin } from 'tdesign-react';
import FilterPanel from '../components/FilterPanel';
import DocumentContent from '../components/DocumentContent';
import { fetchDocuments, fetchBusinesses, fetchScenes } from '@/lib/kmsApi';
import type { Document, Business, Scene } from '@project/shared';

interface ExtendedDocument extends Document {
  businessName?: string;
  sceneName?: string;
  source?: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<ExtendedDocument[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 筛选状态
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [selectedScene, setSelectedScene] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 视图模式
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  // 加载初始数据
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [docsData, businessData, sceneData] = await Promise.all([
          fetchDocuments(),
          fetchBusinesses(),
          fetchScenes(),
        ]);

        // Create lookup maps for business and scene names
        const businessMap = new Map(businessData.map((b: Business) => [b.id, b.name]));
        const sceneMap = new Map(sceneData.map((s: Scene) => [s.id, s.name]));

        // Enrich documents with business and scene names
        const enrichedDocs = docsData.map((doc: Document) => ({
          ...doc,
          businessName: businessMap.get(doc.businessId) || '',
          sceneName: doc.sceneId ? sceneMap.get(doc.sceneId) || '' : '',
          source: 'PDF', // Default source
        })) as ExtendedDocument[];

        setDocuments(enrichedDocs);
        setBusinesses(businessData);
        setScenes(sceneData);
      } catch (error) {
        console.error('Failed to load data:', error);
        MessagePlugin.error('加载数据失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // 筛选逻辑
  const filteredDocuments = documents.filter((doc): boolean => {
    let matches = true;

    if (selectedBusiness && doc.businessId !== selectedBusiness) {
      matches = false;
    }

    if (selectedScene && doc.sceneId !== selectedScene) {
      matches = false;
    }

    if (selectedStatus && doc.status !== selectedStatus) {
      matches = false;
    }

    if (searchKeyword && matches) {
      const keyword = searchKeyword.toLowerCase();
      const titleMatch = doc.title.toLowerCase().includes(keyword);
      const businessMatch = (doc.businessName || '').toLowerCase().includes(keyword);
      const sceneMatch = (doc.sceneName || '').toLowerCase().includes(keyword);
      matches = titleMatch || businessMatch || sceneMatch;
    }

    return matches;
  });

  // 重置筛选
  const handleReset = () => {
    setSelectedBusiness('');
    setSelectedScene('');
    setSelectedStatus('');
    setSearchKeyword('');
  };

  // 处理操作
  const handleView = (id: string) => {
    MessagePlugin.info(`查看文档: ${id}`);
  };

  const handleEdit = (id: string) => {
    MessagePlugin.info(`编辑文档: ${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('确认删除此文档吗？')) {
      setDocuments(documents.filter((doc) => doc.id !== id));
      MessagePlugin.success('文档已删除');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <FilterPanel
        businesses={businesses}
        scenes={scenes}
        selectedBusiness={selectedBusiness}
        selectedScene={selectedScene}
        selectedStatus={selectedStatus}
        searchKeyword={searchKeyword}
        onBusinessChange={setSelectedBusiness}
        onSceneChange={setSelectedScene}
        onStatusChange={setSelectedStatus}
        onSearchChange={setSearchKeyword}
        onReset={handleReset}
      />

      <DocumentContent
        documents={filteredDocuments}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
