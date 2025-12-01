// Lightweight local mock API for chat UI (used only by the front-end demo)
import type { ChatMessage as SharedMessage, ChatSession as SharedSession } from '@project/shared';

type Attachment = { name: string; url: string; type?: string };
type LocalMessage = SharedMessage & { attachments?: Attachment[] };
type LocalSession = SharedSession & { title?: string; isRead?: boolean };

let sessions: LocalSession[] = [
  {
    id: 's1',
    title: '智能咨询助理（RAG）',
    businessId: '',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    isRead: false,
  },
  {
    id: 's2',
    title: '项目 Q&A',
    businessId: '',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    isRead: true,
  },
];

const messagesStore: Record<string, LocalMessage[]> = {
  s1: [
    {
      id: 'm1',
      sessionId: 's1',
      role: 'user',
      content: 'RAG 是什么？',
      createdAt: new Date().toISOString(),
      attachments: [],
    },
    {
      id: 'm2',
      sessionId: 's1',
      role: 'assistant',
      content:
        'RAG（Retrieval-Augmented Generation）是将检索到的文档作为上下文，辅助生成更准确答案的技术。',
      createdAt: new Date().toISOString(),
      attachments: [{ name: 'RAG 技术白皮书.pdf', url: '/files/rag.pdf', type: 'pdf' }],
    },
  ],
  s2: [
    {
      id: 'm3',
      sessionId: 's2',
      role: 'user',
      content: '今天的上线清单有哪些？',
      createdAt: new Date().toISOString(),
      attachments: [],
    },
  ],
};

export async function listSessions(): Promise<LocalSession[]> {
  await new Promise((r) => setTimeout(r, 80));
  return sessions.slice().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function createSession(title?: string): Promise<LocalSession> {
  const id = 's' + Math.random().toString(36).slice(2, 9);
  const s: LocalSession = {
    id,
    title: title || '新会话',
    businessId: '',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    isRead: false,
  };
  sessions.unshift(s);
  messagesStore[id] = [];
  return s;
}

export async function deleteSession(id: string): Promise<void> {
  sessions = sessions.filter((s) => s.id !== id);
  delete messagesStore[id];
}

export async function getSessionMessages(sessionId: string): Promise<LocalMessage[]> {
  await new Promise((r) => setTimeout(r, 60));
  return (messagesStore[sessionId] || []).slice();
}

export async function sendMessage(sessionId: string, content: string): Promise<LocalMessage> {
  const userMsg: LocalMessage = {
    id: 'm' + Math.random().toString(36).slice(2, 9),
    sessionId,
    role: 'user',
    content,
    createdAt: new Date().toISOString(),
    attachments: [],
  };
  messagesStore[sessionId] = messagesStore[sessionId] || [];
  messagesStore[sessionId].push(userMsg);
  const sess = sessions.find((s) => s.id === sessionId);
  if (sess) sess.updatedAt = new Date().toISOString();

  // simulate assistant reply
  setTimeout(() => {
    const assistant: LocalMessage = {
      id: 'm' + Math.random().toString(36).slice(2, 9),
      sessionId,
      role: 'assistant',
      content: `关于“${content}”的回复（模拟）`,
      createdAt: new Date().toISOString(),
      attachments: content.toLowerCase().includes('白皮书')
        ? [{ name: 'RAG 技术白皮书.pdf', url: '/files/rag.pdf', type: 'pdf' }]
        : [],
    };
    messagesStore[sessionId].push(assistant);
    const s2 = sessions.find((s) => s.id === sessionId);
    if (s2) s2.updatedAt = new Date().toISOString();
  }, 500);

  return userMsg;
}
