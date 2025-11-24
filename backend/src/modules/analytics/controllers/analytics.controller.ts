import { FastifyRequest, FastifyReply } from 'fastify';

export class AnalyticsController {
  // TODO: inject AnalyticsService via constructor when wiring routes to controller
  async getHeatmap(_req: FastifyRequest, reply: FastifyReply) {
    // TODO: call service
    reply.send({ points: [] });
  }
}
