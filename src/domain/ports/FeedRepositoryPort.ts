import { Feed } from '../entities/Feed';

export interface FeedRepositoryPort {
  save(feed: Feed): Promise<Feed>;
  saveFeedsBatch(feeds: Feed[]): Promise<Feed[]>;
  findById(id: string): Promise<Feed | null>;
  findAll(startDate: Date, endDate: Date): Promise<Feed[]>;
  deleteById(id: string): Promise<void>;
  updateById(id: string, feed: Feed): Promise<Feed | null>;
}
