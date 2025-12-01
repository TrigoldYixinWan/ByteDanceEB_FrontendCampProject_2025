// 扩展项目中已有的聊天相关类型
import { ChatSession, ChatMessage, AskResponseReference } from '@project/shared';

export interface SessionWithTitle extends ChatSession {
  title: string;
  unread: boolean;
}

export interface MessageWithReferences extends ChatMessage {
  references?: AskResponseReference[];
}

export interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export interface SidebarProps {
  sessions: SessionWithTitle[];
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
}

export interface ChatHeaderProps {
  title: string;
  onRefresh: () => void;
  onDelete: () => void;
}

export interface MessageListProps {
  messages: MessageWithReferences[];
}

export interface MessageItemProps {
  message: MessageWithReferences;
  isLast?: boolean;
}

export interface FileReferenceProps {
  references: AskResponseReference[];
}
