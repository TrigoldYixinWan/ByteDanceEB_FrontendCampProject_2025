import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { Container } from '../../../core/container';

export function createAnalyticsRouter(_container: Container): FastifyPluginCallback {
  return (app: FastifyInstance, _opts, done) => {
    // TODO: /heatmap, /top-questions, /zero-hit using AnalyticsService
    app.get('/health', async () => ({ status: 'placeholder' }));
    done();
  };
}
