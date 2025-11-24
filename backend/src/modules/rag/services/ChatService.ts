import { AskRequest, AskResponse } from '@project/shared';

export interface StreamSink {
  write(chunk: string): void;
  end(): void;
}

export class ChatService {
  async ask(_request: AskRequest): Promise<AskResponse> {
    // TODO:
    // 1. Embed question
    // 2. RetrievalService.searchChunks()
    // 3. Build prompt
    // 4. ProviderRegistry.getActiveProvider().complete()
    // 5. Persist chat message
    // 6. Return AskResponse { answer, references, sessionId }
    throw new Error('Not implemented');
  }

  async askStream(_request: AskRequest, _streamSink: StreamSink): Promise<void> {
    // TODO: same pipeline as ask(), but stream tokens via streamSink.write()
    // and finalize with streamSink.end()
    throw new Error('Not implemented');
  }
}
