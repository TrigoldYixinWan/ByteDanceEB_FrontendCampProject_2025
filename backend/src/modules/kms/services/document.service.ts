import { CreateDocumentDto, Document, DocumentStatusDto, DocumentStatus } from '@project/shared';
import { Container } from '../../../core/container';
import { DocumentRepository } from '../repositories/document.repository';

export class DocumentService {
  private repo: DocumentRepository;

  constructor(private container: Container) {
    // For now instantiate directly (could DI later)
    this.repo = new DocumentRepository();
  }

  async createDocument(dto: CreateDocumentDto): Promise<Document> {
    const doc = this.repo.create(dto);
    // Simulate async processing
    setTimeout(() => this.handleDocumentProcessingJob({ documentId: doc.id }), 150);
    return doc;
  }

  async getDocumentStatus(id: string): Promise<DocumentStatusDto> {
    const doc = this.repo.getById(id);
    if (!doc) throw new Error('Document not found');
    return { id: doc.id, status: doc.status, updatedAt: doc.updatedAt };
  }

  async handleDocumentProcessingJob(jobPayload: { documentId: string }): Promise<void> {
    const doc = this.repo.getById(jobPayload.documentId);
    if (!doc) return;
    // Simplified success path
    this.repo.updateStatus(doc.id, DocumentStatus.Active);
  }

  async queryDocuments(filters?: {
    businessId?: string;
    sceneId?: string;
    status?: string;
    keyword?: string;
  }): Promise<Document[]> {
    const statusFilter = filters?.status ? (filters.status as DocumentStatus) : undefined;
    return this.repo.query({
      businessId: filters?.businessId,
      sceneId: filters?.sceneId,
      status: statusFilter,
      keyword: filters?.keyword,
    });
  }

  async getAllDocuments(): Promise<Document[]> {
    return this.repo.getAll();
  }
}
