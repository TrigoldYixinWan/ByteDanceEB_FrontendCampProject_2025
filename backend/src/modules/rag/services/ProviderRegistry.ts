export interface LlmProvider {
  name: string;
  complete(prompt: string): Promise<string>;
}

export class ProviderRegistry {
  private providers: Map<string, LlmProvider> = new Map();
  private active?: string;

  register(provider: LlmProvider) {
    this.providers.set(provider.name, provider);
    if (!this.active) this.active = provider.name;
  }

  setActive(name: string) {
    if (!this.providers.has(name)) throw new Error('Provider not found');
    this.active = name;
  }

  getActive(): LlmProvider {
    if (!this.active) throw new Error('No provider registered');
    const p = this.providers.get(this.active);
    if (!p) throw new Error('Active provider missing');
    return p;
  }
}
