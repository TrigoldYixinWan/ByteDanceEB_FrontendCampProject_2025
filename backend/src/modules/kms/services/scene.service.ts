import { Scene } from '@project/shared';
import { Container } from '../../../core/container';
import { SceneRepository } from '../repositories/scene.repository';

export class SceneService {
  private repo: SceneRepository;

  constructor(private container: Container) {
    this.repo = new SceneRepository();
  }

  async getAllScenes(): Promise<Scene[]> {
    return this.repo.getAll();
  }

  async getSceneById(id: string): Promise<Scene | undefined> {
    return this.repo.getById(id);
  }

  async getScenesByBusinessId(businessId: string): Promise<Scene[]> {
    return this.repo.getByBusinessId(businessId);
  }
}
