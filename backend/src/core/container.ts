// Simple DI Container (can be replaced with Inversify in future)
export type Factory<T> = (c: Container) => T;

export class Container {
  private singletons = new Map<string, unknown>();
  private factories = new Map<string, (c: Container) => unknown>();

  registerSingleton<T>(key: string, factory: Factory<T>): void {
    const wrapper = (c: Container): unknown => {
      if (!this.singletons.has(key)) {
        this.singletons.set(key, factory(c));
      }
      return this.singletons.get(key);
    };
    this.factories.set(key, wrapper);
  }

  register<T>(key: string, factory: Factory<T>): void {
    this.factories.set(key, factory as (c: Container) => unknown);
  }

  resolve<T>(key: string): T {
    const factory = this.factories.get(key) as Factory<T> | undefined;
    if (!factory) throw new Error(`Dependency not found: ${key}`);
    return factory(this);
  }
}

// Registry keys (string tokens)
export const DI_KEYS = {
  DbClient: 'DbClient',
  VectorClient: 'VectorClient',
  QueueClient: 'QueueClient',
  // KMS
  BusinessService: 'BusinessService',
  SceneService: 'SceneService',
  DocumentService: 'DocumentService',
  BusinessRepository: 'BusinessRepository',
  SceneRepository: 'SceneRepository',
  DocumentRepository: 'DocumentRepository',
  // RAG / Chat
  ChatService: 'ChatService',
  RetrievalService: 'RetrievalService',
  ProviderRegistry: 'ProviderRegistry',
  ChatSessionRepository: 'ChatSessionRepository',
  ChatMessageRepository: 'ChatMessageRepository',
  // Analytics
  AnalyticsService: 'AnalyticsService',
  AnalyticsRepository: 'AnalyticsRepository',
} as const;
