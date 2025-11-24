export class DbClient {
  // TODO: implement actual database connection pooling
  connect(): void {
    // Placeholder
  }
}

export function createDbClient(): DbClient {
  const client = new DbClient();
  client.connect();
  return client;
}
