import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { AskRequest } from '@project/shared';
import { Container, DI_KEYS } from '../../../core/container';
import { ChatService } from '../services/ChatService';

export function createChatRouter(container: Container): FastifyPluginCallback {
  return (app: FastifyInstance, _opts, done) => {
    app.post('/ask', async (request, reply) => {
      const body = request.body as AskRequest; // TODO: validation
      const chatService = container.resolve(DI_KEYS.ChatService) as unknown as ChatService;
      try {
        const res = await chatService.ask(body);
        reply.send(res);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        reply.code(500).send({ error: message });
      }
    });

    app.get('/ask/stream', async (_request, reply) => {
      // SSE placeholder: future implementation
      // TODO: reply.raw headers, stream tokens via chatService.askStream()
      reply.code(501).send({ error: 'SSE not implemented yet' });
    });
    done();
  };
}
