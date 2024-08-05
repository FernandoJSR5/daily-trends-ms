import { getDate } from '../../../src//utils/dateUtils';
import { FeedUseCases } from '../../../src/application/use-cases/FeedUseCases';
import { FeedBuilder } from '../../../src/domain/builders/FeedBuilder';
import { Feed } from '../../../src/domain/entities/Feed';
import { FeedRepositoryPort } from '../../../src/domain/ports/FeedRepositoryPort';

const mockFeedRepository: jest.Mocked<FeedRepositoryPort> = {
  save: jest.fn(),
  saveFeedsBatch: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  deleteById: jest.fn(),
  updateById: jest.fn(),
};

const mockScrapingService = {
  scrapeManager: jest
    .fn()
    .mockResolvedValue([
      new Feed('title1', 'description1', 'author1', 'journal1', 'link1'),
    ] as Feed[]),
};

describe('FeedUseCases', () => {
  let feedUseCases: FeedUseCases;

  beforeEach(() => {
    feedUseCases = new FeedUseCases(
      mockFeedRepository,
      mockScrapingService as any,
    );
  });

  it('should save a batch of feeds', async () => {
    const feeds = [
      {
        title: 'title1',
        link: 'link1',
        description: 'description1',
        author: 'author1',
        journal: 'journal1',
      },
      {
        title: 'title2',
        link: 'link2',
        description: 'description2',
        author: 'author2',
        journal: 'journal2',
      },
    ];

    (mockFeedRepository.saveFeedsBatch as jest.Mock).mockResolvedValue(
      feeds as Feed[],
    );

    const result = await feedUseCases.saveFeedsBatch(feeds);

    expect(result).toEqual(feeds);
    expect(mockFeedRepository.saveFeedsBatch).toHaveBeenCalledWith(feeds);
  });

  it('should get feeds and scrape if empty', async () => {
    const timezone = 'Europe/Madrid';
    const startDate = getDate(0, 0, 0, 0, timezone);
    const endDate = getDate(0, 0, 0, 0, timezone, true);

    (mockFeedRepository.findAll as jest.Mock).mockResolvedValue([]);
    (mockScrapingService.scrapeManager as jest.Mock).mockResolvedValue([
      new Feed('title1', 'description1', 'author1', 'journal1', 'link1'),
    ] as Feed[]);

    const result = await feedUseCases.getFeeds();

    expect(result).toEqual([
      new Feed('title1', 'description1', 'author1', 'journal1', 'link1'),
    ] as Feed[]);

    const calls = (mockFeedRepository.findAll as jest.Mock).mock.calls;
    expect(calls.length).toBe(1);
    const [actualStartDate, actualEndDate] = calls[0];
    const tolerance = 1000;

    expect(
      Math.abs(actualStartDate.getTime() - startDate.getTime()),
    ).toBeLessThan(tolerance);
    expect(Math.abs(actualEndDate.getTime() - endDate.getTime())).toBeLessThan(
      tolerance,
    );

    expect(mockScrapingService.scrapeManager).toHaveBeenCalled();
  });

  it('should save a feed', async () => {
    const feed = new FeedBuilder()
      .setTitle('title')
      .setDescription('description')
      .setAuthor('author')
      .setJournal('journal')
      .setLink('link')
      .build();

    (mockFeedRepository.save as jest.Mock).mockResolvedValue(feed);

    const result = await feedUseCases.saveFeed({
      title: 'title',
      description: 'description',
      author: 'author',
      journal: 'journal',
      link: 'link',
    });

    expect(result).toEqual(feed);
    expect(mockFeedRepository.save).toHaveBeenCalledWith(feed);
  });

  it('should find a feed by id', async () => {
    const feed = new Feed('title', 'description', 'author', 'journal', 'link');
    (mockFeedRepository.findById as jest.Mock).mockResolvedValue(feed);

    const result = await feedUseCases.findFeedById('1');

    expect(result).toEqual(feed);
    expect(mockFeedRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should delete a feed by id', async () => {
    await feedUseCases.deleteFeedById('1');

    expect(mockFeedRepository.deleteById).toHaveBeenCalledWith('1');
  });

  it('should update a feed by id', async () => {
    const feed = new Feed('title', 'description', 'author', 'journal', 'link');
    (mockFeedRepository.updateById as jest.Mock).mockResolvedValue(feed);

    const result = await feedUseCases.updateFeed('1', feed);

    expect(result).toEqual(feed);
    expect(mockFeedRepository.updateById).toHaveBeenCalledWith('1', feed);
  });
});
