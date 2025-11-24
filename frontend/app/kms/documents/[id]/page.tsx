"use client";
import { DocumentStatusDto } from '@project/shared';
import React from 'react';

interface Props {
  params: { id: string };
}

export default function DocumentDetailPage({ params }: Props) {
  const [status] = React.useState<DocumentStatusDto | null>(null);
  return (
    <div>
      <h2>文档详情: {params.id}</h2>
      {!status && <p>加载中 (占位)</p>}
      {status ? (
        <div>
          <p>状态: {status.status}</p>
          <p>最后更新时间: {status.updatedAt}</p>
        </div>
      ) : null}
    </div>
  );
}
