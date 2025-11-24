import { HeatmapResponse, TopQuestionsResponse, ZeroHitQuestionsResponse } from '@project/shared';
import { apiFetch } from './apiClient';

export function getHeatmap(): Promise<HeatmapResponse> {
  return apiFetch<HeatmapResponse>('/api/analytics/heatmap'); // TODO backend implementation
}

export function getTopQuestions(): Promise<TopQuestionsResponse> {
  return apiFetch<TopQuestionsResponse>('/api/analytics/top-questions');
}

export function getZeroHitQuestions(): Promise<ZeroHitQuestionsResponse> {
  return apiFetch<ZeroHitQuestionsResponse>('/api/analytics/zero-hit');
}
