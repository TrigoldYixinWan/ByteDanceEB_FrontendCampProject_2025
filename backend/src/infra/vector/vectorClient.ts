export class VectorClient {
  // TODO: connect to vector database (e.g., PGVector, Milvus, Pinecone)
  init(): void {
    // Placeholder
  }
}

export function createVectorClient(): VectorClient {
  const client = new VectorClient();
  client.init();
  return client;
}
