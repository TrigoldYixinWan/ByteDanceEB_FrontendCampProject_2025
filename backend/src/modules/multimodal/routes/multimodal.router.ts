import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { Container } from '../../../core/container';

export function createMultimodalRouter(_container: Container): FastifyPluginCallback {
  return (app: FastifyInstance, _opts, done) => {
    // TODO: OCR/image processing endpoints
    app.get('/health', async () => ({ status: 'placeholder' }));
    done();
  };
}
