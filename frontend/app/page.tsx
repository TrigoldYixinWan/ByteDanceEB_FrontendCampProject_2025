import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>商家知识管理 + RAG 问答机器人</h1>
      <ul>
        <li><Link href="/kms">KMS 控制台</Link></li>
        <li><Link href="/chat">Chat 机器人</Link></li>
        <li><Link href="/analytics">分析后台</Link></li>
      </ul>
    </div>
  );
}
