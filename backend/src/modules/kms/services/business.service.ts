import { Business } from '@project/shared';
import { Container } from '../../../core/container';
import { BusinessRepository } from '../repositories/business.repository';

export class BusinessService {
  private repo: BusinessRepository;

  constructor(private container: Container) {
    this.repo = new BusinessRepository();
  }

  async getAllBusinesses(): Promise<Business[]> {
    return this.repo.getAll();
  }

  async getBusinessById(id: string): Promise<Business | undefined> {
    return this.repo.getById(id);
  }
}
