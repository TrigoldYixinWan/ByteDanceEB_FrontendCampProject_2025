import React from 'react';

export default function KmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <section style={{ display: 'flex' }}>
      <aside style={{ width: 200, borderRight: '1px solid #ddd', padding: 12 }}>
        <nav>
          <ul>
            <li><a href="/kms">Dashboard</a></li>
            <li><a href="/kms/business">业务</a></li>
            <li><a href="/kms/scenes">场景</a></li>
            <li><a href="/kms/documents">文档</a></li>
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 24 }}>{children}</main>
    </section>
  );
}
