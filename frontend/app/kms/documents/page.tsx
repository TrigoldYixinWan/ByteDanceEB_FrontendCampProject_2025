import { Document } from '@project/shared';
import Link from 'next/link';

export default function DocumentsPage() {
  const docs: Document[] = []; // TODO: fetch
  return (
    <div>
      <h2>文档列表</h2>
      {docs.length === 0 && <p>暂无文档 (占位)</p>}
      <ul>
        {docs.map((d) => (
          <li key={d.id}>
            <Link href={`/kms/documents/${d.id}`}>{d.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
