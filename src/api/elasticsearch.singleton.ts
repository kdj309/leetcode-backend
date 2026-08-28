/**
 * Elasticsearch Client Singleton Pattern
 *
 * Explicit singleton implementation for better control and clarity
 * Ensures only ONE instance of ElasticsearchClient is created across the entire application
 */

import { Client } from '@elastic/elasticsearch';
import { config } from 'src/config/config';

class ElasticsearchClientSingleton {
  private static instance: Client | null = null;

  /**
   * Get or create the Elasticsearch client instance
   * @returns The singleton instance of Elasticsearch Client
   */
  public static getInstance(): Client {
    if (!ElasticsearchClientSingleton.instance) {
      console.log(
        '[ElasticsearchClient] Initializing singleton instance...',
        config().elasticsearch.node,
      );

      ElasticsearchClientSingleton.instance = new Client({
        node: config().elasticsearch.node,
        auth: {
          username: config().elasticsearch.username,
          password: config().elasticsearch.password,
        },
      });

      console.log(
        '[ElasticsearchClient] Singleton instance created successfully',
      );
    } else {
      console.log(
        '[ElasticsearchClient] Returning existing singleton instance',
      );
    }

    return ElasticsearchClientSingleton.instance;
  }

  /**
   * Get client info for debugging
   */
  public static getInfo() {
    return {
      isInitialized: ElasticsearchClientSingleton.instance !== null,
      node: config().elasticsearch.node,
      hasApiKey: !!config().elasticsearch.password,
    };
  }

  /**
   * Reset the singleton (use only for testing)
   */
  public static resetInstance() {
    ElasticsearchClientSingleton.instance = null;
  }
}

export const elasticSearchClient = ElasticsearchClientSingleton.getInstance();
export const createIndex = async () => {
  const indexName = 'problems_v3';

  const exists = await elasticSearchClient.indices.exists({ index: indexName });

  if (!exists) {
    await elasticSearchClient.indices.create({
      index: indexName,
      mappings: {
        properties: {
          title: {
            type: 'text',
            fields: {
              keyword: { type: 'keyword' },
            },
          },
          description: {
            type: 'text',
          },
          difficulty: {
            type: 'keyword',
          },
        },
      },
    });

    console.log('✅ Index created');
  } else {
    console.log('⚠️ Index already exists');
  }
};
export const bulkIndexProblems = async (problems: any[]) => {
  const operations = problems.flatMap((problem) => [
    {
      index: {
        _index: 'problems_v3',
        _id: problem._id.toString(), // 🔥 IMPORTANT
      },
    },
    {
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
    },
  ]);

  await elasticSearchClient.bulk({
    refresh: true,
    operations,
  });

  console.log('🚀 Data indexed');
};
