// Extend FastifyInstance with DI container reference
import { Container } from '../core/container';

declare module 'fastify' {
  interface FastifyInstance {
    diContainer?: Container;
  }
}
