import { DocumentChunk } from '@project/shared';

export class RetrievalService {
  async searchChunks(
    _queryEmbedding: number[],
    _opts?: { topK?: number },
  ): Promise<DocumentChunk[]> {
    // TODO: use VectorClient to retrieve relevant chunks
    throw new Error('Not implemented');
  }
}
