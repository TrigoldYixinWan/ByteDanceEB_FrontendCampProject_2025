import { Document, DocumentStatus, CreateDocumentDto } from '@project/shared';

interface StoredDocument extends Document {}

export class DocumentRepository {
  private docs = new Map<string, StoredDocument>();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleDocs: StoredDocument[] = [
      {
        id: 'doc_001',
        businessId: 'biz_001',
        sceneId: 'scene_001',
        title: '商家入驻流程指南',
        status: DocumentStatus.Active,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'doc_002',
        businessId: 'biz_002',
        sceneId: 'scene_002',
        title: '商品发布规范',
        status: DocumentStatus.Active,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'doc_003',
        businessId: 'biz_003',
        sceneId: 'scene_003',
        title: '订单处理流程',
        status: DocumentStatus.Processing,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'doc_004',
        businessId: 'biz_004',
        sceneId: 'scene_004',
        title: '售后服务标准',
        status: DocumentStatus.Active,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'doc_005',
        businessId: 'biz_005',
        sceneId: 'scene_005',
        title: '营销活动规则',
        status: DocumentStatus.Failed,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'doc_006',
        businessId: 'biz_006',
        sceneId: 'scene_006',
        title: '店铺运营指南',
        status: DocumentStatus.Active,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    sampleDocs.forEach((d) => this.docs.set(d.id, d));
  }

  create(dto: CreateDocumentDto): StoredDocument {
    const now = new Date().toISOString();
    const id = 'doc_' + Math.random().toString(36).slice(2, 11);
    const doc: StoredDocument = {
      id,
      businessId: dto.businessId,
      sceneId: dto.sceneId,
      title: dto.title,
      status: DocumentStatus.Processing,
      createdAt: now,
      updatedAt: now,
    };
    this.docs.set(id, doc);
    return doc;
  }

  getById(id: string): StoredDocument | undefined {
    return this.docs.get(id);
  }

  updateStatus(id: string, status: DocumentStatus): StoredDocument | undefined {
    const doc = this.docs.get(id);
    if (!doc) return undefined;
    doc.status = status;
    doc.updatedAt = new Date().toISOString();
    return doc;
  }

  getAll(): StoredDocument[] {
    return Array.from(this.docs.values());
  }

  query(filters?: {
    businessId?: string;
    sceneId?: string;
    status?: DocumentStatus;
    keyword?: string;
  }): StoredDocument[] {
    let results = this.getAll();

    if (filters?.businessId) {
      results = results.filter((d) => d.businessId === filters.businessId);
    }

    if (filters?.sceneId) {
      results = results.filter((d) => d.sceneId === filters.sceneId);
    }

    if (filters?.status) {
      results = results.filter((d) => d.status === filters.status);
    }

    if (filters?.keyword) {
      const keyword = filters.keyword.toLowerCase();
      results = results.filter(
        (d) =>
          d.title.toLowerCase().includes(keyword) ||
          d.businessId.toLowerCase().includes(keyword) ||
          (d.sceneId && d.sceneId.toLowerCase().includes(keyword)),
      );
    }

    return results;
  }
}
