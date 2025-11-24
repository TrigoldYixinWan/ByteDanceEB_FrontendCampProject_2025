export class QueueClient {
  // TODO: integrate BullMQ/Redis
  enqueueDocumentProcessingJob(_documentId: string): void {
    // TODO: push job { type: QueueJobType.DocumentProcessing, documentId }
  }
}

export function createQueueClient(): QueueClient {
  return new QueueClient();
}
