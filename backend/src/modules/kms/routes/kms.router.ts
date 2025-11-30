import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { Container, DI_KEYS } from '../../../core/container';
import { CreateDocumentDto } from '@project/shared';
import { DocumentService } from '../services/document.service';
import { BusinessService } from '../services/business.service';
import { SceneService } from '../services/scene.service';

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

    // GET all documents with optional filters
    app.get('/documents', async (request, reply) => {
      const query = request.query as {
        businessId?: string;
        sceneId?: string;
        status?: string;
        keyword?: string;
      };
      const service = container.resolve(DI_KEYS.DocumentService) as unknown as DocumentService;
      try {
        const docs = await service.queryDocuments(query);
        reply.send(docs);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        reply.code(500).send({ error: message });
      }
    });

    // GET all businesses
    app.get('/businesses', async (request, reply) => {
      const service = new BusinessService(container);
      try {
        const businesses = await service.getAllBusinesses();
        reply.send(businesses);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        reply.code(500).send({ error: message });
      }
    });

    // GET all scenes
    app.get('/scenes', async (request, reply) => {
      const service = new SceneService(container);
      try {
        const scenes = await service.getAllScenes();
        reply.send(scenes);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        reply.code(500).send({ error: message });
      }
    });

    // GET scenes by business ID
    app.get('/businesses/:businessId/scenes', async (request, reply) => {
      const { businessId } = request.params as { businessId: string };
      const service = new SceneService(container);
      try {
        const scenes = await service.getScenesByBusinessId(businessId);
        reply.send(scenes);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        reply.code(500).send({ error: message });
      }
    });

    done();
  };
}
