import {
  CreateDocumentDto,
  Document,
  DocumentStatusDto,
  PaginatedDocumentsDto,
} from '@project/shared';
import { apiFetch } from './apiClient';

export function createDocument(dto: CreateDocumentDto): Promise<Document> {
  // TODO: POST /api/kms/documents
  return apiFetch<Document>('/api/kms/documents', { method: 'POST', body: JSON.stringify(dto) });
}

export function getDocumentStatus(id: string): Promise<DocumentStatusDto> {
  return apiFetch<DocumentStatusDto>(`/api/kms/documents/${id}/status`);
}

export function listDocuments(page = 1, pageSize = 20): Promise<PaginatedDocumentsDto> {
  // TODO: add query params
  return apiFetch<PaginatedDocumentsDto>(`/api/kms/documents?page=${page}&pageSize=${pageSize}`);
}
