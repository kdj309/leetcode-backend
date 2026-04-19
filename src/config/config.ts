import { ConfigProps } from 'src/interfaces/config.interface';
import * as dotenv from 'dotenv';
dotenv.config();
export const config = (): ConfigProps => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  api: {
    apiUrl: process.env.API_URL,
    httpTimeout: 1000,
  },
  mongodb: {
    database: {
      connectionString:
        process.env.MONGODB_CONNECTION_STRING ||
        'mongodb://localhost:27017/leetcode',
      databaseName: process.env.NODE_ENV || 'local',
    },
  },
  redis: {
    url: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT,
  },
  judge: {
    url: process.env.JUDGEAPI_BASE_URL,
    key: process.env.JUDGEAPI_API_KEY,
    host: process.env.JUDGEAPI_HOST,
  },
  elasticsearch: {
    node: process.env.ELASTICSEARCH_NODE,
    apiKey: process.env.ELASTICSEARCH_API_KEY,
  },
});
