import dotenv from 'dotenv';

dotenv.config();

export interface AppConfig {
  port: number;
  dbUrl?: string;
  vectorDbUrl?: string;
  queueUrl?: string;
  openAiApiKey?: string;
}

export function loadConfig(): AppConfig {
  return {
    port: parseInt(process.env.BACKEND_PORT || '3001', 10),
    dbUrl: process.env.DB_URL,
    vectorDbUrl: process.env.VECTOR_DB_URL,
    queueUrl: process.env.QUEUE_URL,
    openAiApiKey: process.env.OPENAI_API_KEY
  };
}
