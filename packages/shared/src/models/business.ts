export enum DocumentStatus {
  Processing = 'processing',
  Active = 'active',
  Failed = 'failed',
}

export interface Business {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Scene {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  businessId: string;
  sceneId?: string;
  title: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  index: number;
  content: string;
  embedding?: number[]; // TODO: will store vector embedding
}
