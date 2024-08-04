/* eslint-disable no-undef */
import { Feed } from '../../domain/entities/Feed';
import Scraper from './scraper';

class PageTwoScraper extends Scraper {
  async scrape(): Promise<Feed[]> {
    console.log(`Starting scraping for "El Mundo" at ${this.url}`);

    try {
      await this.page.goto(this.url, { waitUntil: 'networkidle2' });
      await this.handleModal();

      await this.page.waitForSelector('article', { timeout: 10000 });

      const feeds = await this.page.evaluate(() => {
        const articles = Array.from(document.querySelectorAll('article')).slice(0, 5);

        return articles.map((article) => {
          const titleElement = article.querySelector('a') as HTMLAnchorElement;
          const title = titleElement?.textContent?.trim() || 'No title';
          const link = titleElement?.href || 'No link';

          const authorElement = article.querySelector('.ue-c-cover-content__byline-name');
          let author = authorElement?.textContent?.trim() || 'No author';
          author = author.replace('Redacción: ', '');

          const descriptionElement = article.querySelector(
            '.ue-c-cover-content__standfirst'
          );
          const description = descriptionElement?.textContent?.trim() || 'No description';

          return {
            title,
            link,
            description,
            author,
            journal: 'El Mundo',
          };
        });
      });

      console.log(`Extracted feeds:`, feeds);
      return feeds;
    } catch (error) {
      console.error(`Error scraping "El Mundo": ${error.message}`);
      return [];
    }
  }

  protected async handleModal(): Promise<void> {
    try {
      await this.page.waitForSelector('.didomi-popup-container', { visible: true });
      await this.page.click('#ue-accept-notice-button');
    } catch (error) {
      console.warn(`Consent modal not found or failed to close. ${error}`);
    }
  }
}

export default PageTwoScraper;
