import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { Container, DI_KEYS } from '../../../core/container';
import { CreateDocumentDto } from '@project/shared';
import { DocumentService } from '../services/document.service';

export function createKmsRouter(container: Container): FastifyPluginCallback {
  return (app: FastifyInstance, _opts, done) => {
    app.post('/documents', async (request, reply) => {
      const body = request.body as CreateDocumentDto; // TODO: validation
      const service = container.resolve(DI_KEYS.DocumentService) as unknown as DocumentService;
      try {
        const doc = await service.createDocument(body);
        reply.code(201).send(doc);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        reply.code(500).send({ error: message });
      }
    });

    app.get('/documents/:id/status', async (request, reply) => {
      const { id } = request.params as { id: string };
      const service = container.resolve(DI_KEYS.DocumentService) as unknown as DocumentService;
      try {
        const status = await service.getDocumentStatus(id);
        reply.send(status);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        reply.code(404).send({ error: message });
      }
    });

    // TODO: business & scene CRUD, document listing
    done();
  };
}
