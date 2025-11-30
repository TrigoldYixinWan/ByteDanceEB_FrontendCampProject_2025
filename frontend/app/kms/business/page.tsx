import { Business } from '@project/shared';

export default function BusinessPage() {
  const items: Business[] = []; // TODO: fetch from backend
  return (
    <div style={{ padding: '20px' }}>
      <h2>业务列表</h2>
      {items.length === 0 && <p>暂无业务 (占位)</p>}
    </div>
  );
}
