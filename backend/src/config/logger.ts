export interface Logger {
  info(msg: string, meta?: unknown): void;
  error(msg: string, meta?: unknown): void;
}

class ConsoleLogger implements Logger {
  info(msg: string, meta?: unknown): void {
    // TODO: enhance with structured logging
    console.log(`[INFO] ${msg}`, meta || '');
  }
  error(msg: string, meta?: unknown): void {
    console.error(`[ERROR] ${msg}`, meta || '');
  }
}

export const logger: Logger = new ConsoleLogger();
