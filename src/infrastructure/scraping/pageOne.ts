/* eslint-disable no-undef */
import { Feed } from '../../domain/entities/Feed';
import Scraper from './scraper';

class PageOneScraper extends Scraper {
  async scrape(): Promise<Feed[]> {
    console.log(`Starting scraping for "El País" at ${this.url}`);

    try {
      await this.page.goto(this.url, { waitUntil: 'networkidle2' });
      await this.handleModal();

      await this.page.waitForSelector('section._g._g-md._g-o.b.b-d', { timeout: 10000 });

      const feeds = await this.page.evaluate(() => {
        const newsSection = document.querySelectorAll('section._g._g-md._g-o.b.b-d');

        if (!newsSection.length) {
          console.error('News section not found.');
          return [];
        }

        return Array.from(newsSection[0].querySelectorAll('h2'))
          .slice(0, 5)
          .map((headline) => {
            const titleElement = headline.querySelector('a');
            const title = titleElement?.textContent?.trim() || 'No title';
            const link = titleElement?.href || 'No link';

            const authorElement = headline.closest('article')?.querySelector('div.c_a');
            let author = 'No author';

            if (authorElement) {
              const links = Array.from(authorElement.querySelectorAll('a'));
              const isFirstLinkInstitution = links[0]?.textContent?.trim() === 'El País';

              author =
                isFirstLinkInstitution && links.length > 1
                  ? links[1]?.textContent?.trim() || 'No author'
                  : links[0]?.textContent?.trim() || 'No author';
            }

            const descriptionElement = headline
              .closest('article')
              ?.querySelector('p.c_d');
            const description =
              descriptionElement?.textContent?.trim() || 'No description';

            return {
              title,
              link,
              description,
              author,
              journal: 'El País',
            };
          });
      });

      console.log(`Extracted feeds:`, feeds);
      return feeds;
    } catch (error) {
      console.error(`Error scraping "El País": ${error.message}`);
      return [];
    }
  }

  protected async handleModal(): Promise<void> {
    try {
      await this.page.waitForSelector('.pmConsentWall-content', { visible: true });
      await this.page.click('.pmConsentWall-button');
    } catch (error) {
      console.warn(`Consent modal not found or failed to close. ${error}`);
    }
  }
}

export default PageOneScraper;
