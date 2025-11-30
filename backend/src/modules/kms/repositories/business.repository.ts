import { Business } from '@project/shared';

interface StoredBusiness extends Business {}

export class BusinessRepository {
  private businesses = new Map<string, StoredBusiness>();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleBusinesses: StoredBusiness[] = [
      {
        id: 'biz_001',
        name: '入驻流程',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'biz_002',
        name: '商品管理',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'biz_003',
        name: '订单管理',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'biz_004',
        name: '售后管理',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'biz_005',
        name: '营销推广',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'biz_006',
        name: '店铺管理',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    sampleBusinesses.forEach((b) => this.businesses.set(b.id, b));
  }

  getAll(): StoredBusiness[] {
    return Array.from(this.businesses.values());
  }

  getById(id: string): StoredBusiness | undefined {
    return this.businesses.get(id);
  }

  create(name: string): StoredBusiness {
    const now = new Date().toISOString();
    const id = 'biz_' + Math.random().toString(36).slice(2, 11);
    const business: StoredBusiness = {
      id,
      name,
      createdAt: now,
      updatedAt: now,
    };
    this.businesses.set(id, business);
    return business;
  }
}
