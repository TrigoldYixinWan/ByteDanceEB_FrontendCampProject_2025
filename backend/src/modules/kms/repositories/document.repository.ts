import { Document, DocumentStatus, CreateDocumentDto } from '@project/shared';

interface StoredDocument extends Document {}

export class DocumentRepository {
  private docs = new Map<string, StoredDocument>();

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
}
