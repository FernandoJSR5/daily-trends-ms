import { Page } from 'puppeteer';
import { Feed } from '../../domain/entities/Feed';

abstract class Scraper {
  protected page: Page;
  protected url: string;

  constructor(page: Page, url: string) {
    this.page = page;
    this.url = url;
  }

  /**
   * Scrapes the page and returns the extracted feeds.
   *
   * @returns {Promise<Feed[]>} - A promise that resolves to an array of scraped feeds.
   */
  abstract scrape(): Promise<Feed[]>;

  /**
   * Handles any modals or dialogs before scraping.
   */
  protected abstract handleModal(): Promise<void>;
}

export default Scraper;
