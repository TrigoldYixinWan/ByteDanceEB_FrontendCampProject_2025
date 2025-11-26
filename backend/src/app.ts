import Fastify from 'fastify';
import cors from '@fastify/cors';
import { registerRouters } from './infra/http/router';
import { Container } from './core/container';

export function createApp(container: Container) {
  const app = Fastify({ logger: false });
  // Allow frontend dev origin (Next.js on 3000)
  app.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const allowed = [/^http:\/\/localhost:3000$/];
      const ok = allowed.some((re) => re.test(origin));
      cb(null, ok);
    },
    credentials: true,
  });
  registerRouters(app, container);
  return app;
}
