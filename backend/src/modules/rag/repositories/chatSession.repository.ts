import { ChatSession } from '@project/shared';

export class ChatSessionRepository {
  async create(_partial: Partial<ChatSession>): Promise<ChatSession> {
    // TODO: persist
    throw new Error('Not implemented');
  }
}
