import { LlmProvider } from '../ProviderRegistry';

export class DummyProvider implements LlmProvider {
  name = 'dummy';
  async complete(prompt: string): Promise<string> {
    // Placeholder deterministic response
    return `Echo: ${prompt.slice(0, 50)}...`;
  }
}
