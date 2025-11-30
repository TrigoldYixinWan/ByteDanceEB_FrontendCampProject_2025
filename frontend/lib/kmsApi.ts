import {
  CreateDocumentDto,
  Document,
  DocumentStatusDto,
  PaginatedDocumentsDto,
  Business,
  Scene,
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

export function fetchDocuments(
  businessId?: string,
  sceneId?: string,
  status?: string,
  keyword?: string,
): Promise<Document[]> {
  const params = new URLSearchParams();
  if (businessId) params.append('businessId', businessId);
  if (sceneId) params.append('sceneId', sceneId);
  if (status) params.append('status', status);
  if (keyword) params.append('keyword', keyword);

  const queryString = params.toString();
  const url = `/api/kms/documents${queryString ? '?' + queryString : ''}`;
  return apiFetch<Document[]>(url);
}

export function fetchBusinesses(): Promise<Business[]> {
  return apiFetch<Business[]>('/api/kms/businesses');
}

export function fetchScenes(): Promise<Scene[]> {
  return apiFetch<Scene[]>('/api/kms/scenes');
}
