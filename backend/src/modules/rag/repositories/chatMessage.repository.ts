import { ChatMessage } from '@project/shared';

export class ChatMessageRepository {
  async add(_message: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage> {
    // TODO: persist
    throw new Error('Not implemented');
  }
}
