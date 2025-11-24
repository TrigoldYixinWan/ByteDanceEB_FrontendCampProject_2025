import { FastifyInstance } from 'fastify';
import { Container } from '../../core/container';
import { createKmsRouter } from '../../modules/kms/routes/kms.router';
import { createChatRouter } from '../../modules/rag/routes/chat.router';
import { createAnalyticsRouter } from '../../modules/analytics/routes/analytics.router';
import { createMultimodalRouter } from '../../modules/multimodal/routes/multimodal.router';

export function registerRouters(app: FastifyInstance, container: Container): void {
  app.register(createKmsRouter(container), { prefix: '/api/kms' });
  app.register(createChatRouter(container), { prefix: '/api/chat' });
  app.register(createAnalyticsRouter(container), { prefix: '/api/analytics' });
  app.register(createMultimodalRouter(container), { prefix: '/api/multimodal' });
}
