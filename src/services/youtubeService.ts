import { prisma } from '@/lib/prisma';
import { DatabaseError } from '@/lib/errors';

export interface YouTubeSearchResult {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  url: string;
  kind: string;
}

/**
 * Service for managing YouTube search caching
 */
export class YouTubeService {
  // Cache duration: 7 days
  private static readonly CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

  /**
   * Get cached search results or null if not found or expired
   */
  static async getCachedResults(query: string): Promise<YouTubeSearchResult[] | null> {
    try {
      const cached = await prisma.youtubeSearchCache.findFirst({
        where: {
          query: query.toLowerCase(),
          expiresAt: {
            gt: new Date(), // Only return if not expired
          },
        },
      });

      if (cached) {
        console.log(`Cache hit for YouTube search: "${query}"`);
        return (cached.results as unknown as YouTubeSearchResult[]) || [];
      }

      return null;
    } catch (error) {
      console.error('Error retrieving cached YouTube results:', error);
      // Don't throw, just return null to fallback to API call
      return null;
    }
  }

  /**
   * Cache search results
   */
  static async cacheResults(
    query: string,
    results: YouTubeSearchResult[]
  ): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + this.CACHE_DURATION_MS);

      // Delete old cache for this query first
      await prisma.youtubeSearchCache.deleteMany({
        where: {
          query: query.toLowerCase(),
        },
      });

      // Create new cache entry
      await prisma.youtubeSearchCache.create({
        data: {
          query: query.toLowerCase(),
          results: JSON.parse(JSON.stringify(results)),
          expiresAt,
        },
      });

      console.log(`Cached YouTube search results for: "${query}"`);
    } catch (error) {
      console.error('Error caching YouTube results:', error);
      // Don't throw, caching failure shouldn't break the search
    }
  }

  /**
   * Clean expired cache entries
   */
  static async cleanExpiredCache(): Promise<number> {
    try {
      const result = await prisma.youtubeSearchCache.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      console.log(`Cleaned ${result.count} expired YouTube search cache entries`);
      return result.count;
    } catch (error) {
      console.error('Error cleaning expired cache:', error);
      return 0;
    }
  }
}
