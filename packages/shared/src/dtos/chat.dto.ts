// (Reserved import placeholder removed: no direct use yet)

export interface AskRequest {
  sessionId?: string; // optional existing session
  question: string;
  businessId: string;
  sceneId?: string;
}

export interface AskResponseReference {
  chunkId: string;
  documentId: string;
  score?: number; // retrieval relevance score
  preview?: string; // snippet
}

export interface AskResponse {
  answer: string;
  references: AskResponseReference[];
  sessionId: string;
}
