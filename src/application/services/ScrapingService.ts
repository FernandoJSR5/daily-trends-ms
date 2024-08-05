import { Feed } from 'domain/entities/Feed';
import puppeteer, { Browser, Page } from 'puppeteer';
import { FeedRepository } from '../../infrastructure/repositories/FeedRepository';
import PageOneScraper from '../../infrastructure/scraping/pageOne';
import PageTwoScraper from '../../infrastructure/scraping/pageTwo';
import Constants from '../../utils/constants';

export class ScrapingService {
  private browser: Browser | null = null;
  private feedRepository: FeedRepository;

  constructor(feedRepository: FeedRepository) {
    this.feedRepository = feedRepository;
  }

  private async launchBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: '/usr/bin/chromium-browser',
      headless: true,  // Establece en false si deseas ver la interfaz del navegador
    });
    }
    return this.browser;
  }

  private async createNewPage(browser: Browser): Promise<Page> {
    return browser.newPage();
  }

  private async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  public async scrapeManager(): Promise<Feed[]> {
    const items = [
      { url: Constants.FIRST_URL, scraperClass: PageOneScraper },
      { url: Constants.SECOND_URL, scraperClass: PageTwoScraper },
    ];

    try {
      const browser = await this.launchBrowser();

      const pages = await Promise.all(items.map(() => this.createNewPage(browser)));

      // Execute scraping functions in parallel
      const scrapers = items.map(
        (item, index) => new item.scraperClass(pages[index], item.url)
      );

      const scrapePromises = scrapers.map((scraper) => scraper.scrape());

      const results: Feed[][] = await Promise.all(scrapePromises);

      const scrapedFeeds: Feed[] = results.flat();

      if (scrapedFeeds.length > 0) {
        const savedFeeds = await this.feedRepository.saveFeedsBatch(scrapedFeeds);
        return savedFeeds;
      } else {
        console.log('No feeds to save.');
        return [];
      }
    } catch (error) {
      console.error('Error during scraping:', error);
      return [];
    } finally {
      await this.closeBrowser();
    }
  }
}

export default ScrapingService;
