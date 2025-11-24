import { Scene } from '@project/shared';

export default function ScenesPage() {
  const scenes: Scene[] = []; // TODO: fetch from backend
  return (
    <div>
      <h2>场景列表</h2>
      {scenes.length === 0 && <p>暂无场景 (占位)</p>}
    </div>
  );
}
