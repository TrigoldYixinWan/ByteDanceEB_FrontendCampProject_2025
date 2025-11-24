import { LlmProvider } from '../ProviderRegistry';

export class OpenAiProvider implements LlmProvider {
  name = 'openai';
  async complete(_prompt: string): Promise<string> {
    // TODO: integrate with OpenAI/compatible APIs
    throw new Error('Not implemented');
  }
}
