'use client';
import { AskRequest, AskResponse } from '@project/shared';
import React from 'react';

export default function ChatPage() {
  const [lastResponse] = React.useState<AskResponse | null>(null);
  const [pending] = React.useState<boolean>(false);
  const _send = async (_req: AskRequest) => {
    // TODO: invoke chatApi.ask(req)
  };
  return (
    <div>
      <h2>Chat 机器人</h2>
      {!lastResponse && <p>尚无回答 (占位)</p>}
      {lastResponse ? (
        <div>
          <h3>答案</h3>
          <p>{lastResponse.answer}</p>
        </div>
      ) : null}
      {pending && <p>加载中...</p>}
    </div>
  );
}
