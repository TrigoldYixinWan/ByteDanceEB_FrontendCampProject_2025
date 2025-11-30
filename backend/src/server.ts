import { createApp } from './app';
import { loadConfig } from './config/env';
import { logger } from './config/logger';
import { Container, DI_KEYS } from './core/container';
import { createDbClient } from './infra/db/dbClient';
import { createVectorClient } from './infra/vector/vectorClient';
import { createQueueClient } from './infra/queue/queueClient';
import { ChatService } from './modules/rag/services/ChatService';
import { RetrievalService } from './modules/rag/services/RetrievalService';
import { ProviderRegistry } from './modules/rag/services/ProviderRegistry';
import { DummyProvider } from './modules/rag/services/providers/DummyProvider';
import { AnalyticsService } from './modules/analytics/services/analytics.service';
import { BusinessService } from './modules/kms/services/business.service';
import { SceneService } from './modules/kms/services/scene.service';
import { DocumentService } from './modules/kms/services/document.service';

async function bootstrap() {
  const config = loadConfig();
  const container = new Container();

  // Infra singletons
  container.registerSingleton(DI_KEYS.DbClient, () => createDbClient());
  container.registerSingleton(DI_KEYS.VectorClient, () => createVectorClient());
  container.registerSingleton(DI_KEYS.QueueClient, () => createQueueClient());

  // Services (repositories omitted placeholders)
  container.register(DI_KEYS.ChatService, () => new ChatService());
  // Make DocumentService a singleton so its in-memory repository persists across requests
  container.registerSingleton(DI_KEYS.DocumentService, () => new DocumentService(container));
  container.register(DI_KEYS.RetrievalService, () => new RetrievalService());
  container.register(DI_KEYS.AnalyticsService, () => new AnalyticsService());
  container.register(DI_KEYS.BusinessService, () => new BusinessService(container));
  container.register(DI_KEYS.SceneService, () => new SceneService(container));
  container.registerSingleton(DI_KEYS.ProviderRegistry, () => {
    const reg = new ProviderRegistry();
    reg.register(new DummyProvider());
    return reg;
  });

  const app = createApp(container);

  try {
    await app.listen({ port: config.port });
    logger.info(`Backend listening on port ${config.port}`);
  } catch (e) {
    logger.error('Failed to start server', e);
    process.exit(1);
  }
}

bootstrap();
