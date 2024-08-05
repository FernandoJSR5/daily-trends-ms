import { FeedBuilder } from '../../domain/builders/FeedBuilder';
import { Feed } from '../../domain/entities/Feed';
import { FeedRepositoryPort } from '../../domain/ports/FeedRepositoryPort';
import { getDate } from '../../utils/dateUtils';
import { ScrapingService } from '../services/ScrapingService';

export class FeedUseCases {
  private feedRepository: FeedRepositoryPort;
  private scrapingService: ScrapingService;

  constructor(feedRepository: FeedRepositoryPort, scrapingService: ScrapingService) {
    this.feedRepository = feedRepository;
    this.scrapingService = scrapingService;
  }

  public async saveFeedsBatch(
    feeds: Array<{
      title: string;
      link: string;
      description: string;
      author: string;
      journal: string;
    }>
  ): Promise<Feed[]> {
    return this.feedRepository.saveFeedsBatch(feeds);
  }

  public async getFeeds(): Promise<Feed[]> {

    const timezone = 'Europe/Madrid';
    const startDate = getDate(0, 0, 0, 0, timezone);
    const endDate = getDate(0, 0, 0, 0, timezone, true);
    const feeds = await this.feedRepository.findAll(startDate, endDate);
    if (feeds.length === 0) {
      return this.scrapingService.scrapeManager();
    }
    return feeds;
  }

  public async saveFeed(values: Partial<Feed>): Promise<Feed> {
    const feed = new FeedBuilder()
      .setTitle(values.title || '')
      .setDescription(values.description || '')
      .setAuthor(values.author || '')
      .setJournal(values.journal || '')
      .setLink(values.link || '')
      .build();

    return this.feedRepository.save(feed);
  }

  public async findFeedById(id: string): Promise<Feed | null> {
    return this.feedRepository.findById(id);
  }

  public async deleteFeedById(id: string): Promise<void> {
    return this.feedRepository.deleteById(id);
  }

  public async updateFeed(id: string, feed: Feed): Promise<Feed | null> {
    return this.feedRepository.updateById(id, feed);
  }


}
