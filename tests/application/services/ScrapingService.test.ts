/* eslint-disable @typescript-eslint/no-explicit-any */
import puppeteer, { Browser, Page } from 'puppeteer';
import ScrapingService from '../../../src/application/services/ScrapingService';
import { Feed } from '../../../src/domain/entities/Feed';
import { FeedRepository } from '../../../src/infrastructure/repositories/FeedRepository';

jest.mock('puppeteer', () => ({
  launch: jest.fn(),
}));

jest.mock('../../../src/infrastructure/scraping/pageOne', () =>
  jest.fn().mockImplementation(() => ({
    scrape: jest
      .fn()
      .mockResolvedValue([
        new Feed('title1', 'description1', 'author1', 'journal1', 'link1'),
      ]),
  })),
);

jest.mock('../../../src/infrastructure/scraping/pageTwo', () =>
  jest.fn().mockImplementation(() => ({
    scrape: jest
      .fn()
      .mockResolvedValue([
        new Feed('title2', 'description2', 'author2', 'journal2', 'link2'),
      ]),
  })),
);

describe('ScrapingService', () => {
  let scrapingService: ScrapingService;
  let mockFeedRepository: jest.Mocked<FeedRepository>;

  beforeEach(() => {
    mockFeedRepository = {
      saveFeedsBatch: jest.fn(),
    } as any;

    scrapingService = new ScrapingService(mockFeedRepository);
  });

  it('should scrape feeds and save them', async () => {
    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue({} as Page),
      close: jest.fn(),
    } as unknown as Browser;

    (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);

    const scrapedFeeds = [
      new Feed('title1', 'description1', 'author1', 'journal1', 'link1'),
      new Feed('title2', 'description2', 'author2', 'journal2', 'link2'),
    ];

    (mockFeedRepository.saveFeedsBatch as jest.Mock).mockResolvedValue(
      scrapedFeeds,
    );

    const result = await scrapingService.scrapeManager();

    expect(result).toEqual(scrapedFeeds);
    expect(mockFeedRepository.saveFeedsBatch).toHaveBeenCalledWith(
      scrapedFeeds,
    );
    expect(puppeteer.launch).toHaveBeenCalled();
    expect(mockBrowser.close).toHaveBeenCalled();
  });

  it('should handle errors during scraping', async () => {
    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue({} as Page),
      close: jest.fn(),
    } as unknown as Browser;

    (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);
    (scrapingService as any).launchBrowser = jest
      .fn()
      .mockRejectedValue(new Error('Launch Error'));

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const result = await scrapingService.scrapeManager();

    expect(result).toEqual([]);
    expect(mockFeedRepository.saveFeedsBatch).not.toHaveBeenCalled();
    expect(puppeteer.launch).toHaveBeenCalled();
    expect(mockBrowser.close).not.toHaveBeenCalled();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error during scraping:',
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});
