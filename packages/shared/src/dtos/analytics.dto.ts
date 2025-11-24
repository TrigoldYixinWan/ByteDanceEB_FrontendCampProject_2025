import { HeatmapPoint, TopQuestion, ZeroHitQuestion } from '../models/analytics';

export interface HeatmapResponse {
  points: HeatmapPoint[];
}

export interface TopQuestionsResponse {
  items: TopQuestion[];
}

export interface ZeroHitQuestionsResponse {
  items: ZeroHitQuestion[];
}
