import { HeatmapResponse, TopQuestionsResponse, ZeroHitQuestionsResponse } from '@project/shared';

export default function AnalyticsPage() {
  const heatmap: HeatmapResponse | null = null; // TODO fetch
  const top: TopQuestionsResponse | null = null;
  const zero: ZeroHitQuestionsResponse | null = null;
  return (
    <div>
      <h2>分析后台</h2>
      {!heatmap && <p>Heatmap 未加载 (占位)</p>}
      {!top && <p>Top 问题未加载 (占位)</p>}
      {!zero && <p>零命中问题未加载 (占位)</p>}
    </div>
  );
}
