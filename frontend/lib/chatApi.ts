import { AskRequest, AskResponse } from '@project/shared';
import { apiFetch } from './apiClient';

export function ask(request: AskRequest): Promise<AskResponse> {
  return apiFetch<AskResponse>('/api/chat/ask', { method: 'POST', body: JSON.stringify(request) });
}

export function askStream(_request: AskRequest): EventSource {
  // SSE placeholder - client would stream tokens
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  // TODO: encode request in query params or switch to POST -> upgrade SSE
  return new EventSource(base + '/api/chat/ask/stream');
}
