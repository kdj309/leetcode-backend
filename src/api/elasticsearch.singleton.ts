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
      console.log('[ElasticsearchClient] Initializing singleton instance...');
      
      ElasticsearchClientSingleton.instance = new Client({
        node: config().elasticsearch.node,
        auth: {
          apiKey: config().elasticsearch.apiKey,
        },
        serverMode: 'serverless',
      });

      console.log('[ElasticsearchClient] Singleton instance created successfully');
    } else {
      console.log('[ElasticsearchClient] Returning existing singleton instance');
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
      hasApiKey: !!config().elasticsearch.apiKey,
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
