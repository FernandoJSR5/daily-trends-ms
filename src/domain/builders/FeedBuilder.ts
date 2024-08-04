import { Feed } from '../entities/Feed';

export class FeedBuilder {
  private title: string;
  private description: string;
  private author: string;
  private journal: string;
  private link: string;

  constructor() {
    this.title = '';
    this.description = '';
    this.author = '';
    this.journal = '';
    this.link = '';
  }

  setTitle(title: string): this {
    this.title = title;
    return this;
  }

  setDescription(description: string): this {
    this.description = description;
    return this;
  }

  setAuthor(author: string): this {
    this.author = author;
    return this;
  }

  setJournal(journal: string): this {
    this.journal = journal;
    return this;
  }

  setLink(link: string): this {
    this.link = link;
    return this;
  }

  build(): Feed {
    if (!this.title || !this.journal || !this.link) {
      throw new Error('Missing required fields: title, journal, or link');
    }

    return new Feed(this.title, this.description, this.author, this.journal, this.link);
  }
}
