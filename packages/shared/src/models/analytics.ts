export interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
}

export interface TopQuestion {
  question: string;
  hits: number;
}

export interface ZeroHitQuestion {
  question: string;
  lastAskedAt: string;
}
