import { Document, DocumentStatus } from '../models/business';

export interface CreateDocumentDto {
  businessId: string;
  sceneId?: string;
  title: string;
  sourceUrl?: string; // TODO: optional original source
}

export interface DocumentStatusDto {
  id: string;
  status: DocumentStatus;
  updatedAt: string;
}

export interface PaginatedDocumentsDto {
  items: Document[];
  page: number;
  pageSize: number;
  total: number;
}
