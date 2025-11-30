import { Scene } from '@project/shared';

interface StoredScene extends Scene {}

export class SceneRepository {
  private scenes = new Map<string, StoredScene>();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleScenes: StoredScene[] = [
      {
        id: 'scene_001',
        businessId: 'biz_001',
        name: '入驻规则',
        description: '商家入驻流程的相关规则',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'scene_002',
        businessId: 'biz_002',
        name: '商品发布',
        description: '商品发布相关规范',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'scene_003',
        businessId: 'biz_003',
        name: '订单处理',
        description: '订单处理流程',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'scene_004',
        businessId: 'biz_004',
        name: '退换货',
        description: '售后退换货服务',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'scene_005',
        businessId: 'biz_005',
        name: '活动管理',
        description: '营销活动相关规则',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'scene_006',
        businessId: 'biz_006',
        name: '店铺装修',
        description: '店铺装修相关指南',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    sampleScenes.forEach((s) => this.scenes.set(s.id, s));
  }

  getAll(): StoredScene[] {
    return Array.from(this.scenes.values());
  }

  getById(id: string): StoredScene | undefined {
    return this.scenes.get(id);
  }

  getByBusinessId(businessId: string): StoredScene[] {
    return Array.from(this.scenes.values()).filter((s) => s.businessId === businessId);
  }

  create(businessId: string, name: string, description: string): StoredScene {
    const now = new Date().toISOString();
    const id = 'scene_' + Math.random().toString(36).slice(2, 11);
    const scene: StoredScene = {
      id,
      businessId,
      name,
      description,
      createdAt: now,
      updatedAt: now,
    };
    this.scenes.set(id, scene);
    return scene;
  }
}
