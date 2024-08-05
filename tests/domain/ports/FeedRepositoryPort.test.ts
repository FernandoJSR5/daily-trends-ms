import { Feed } from '../../../src/domain/entities/Feed';
import { FeedRepositoryPort } from '../../../src/domain/ports/FeedRepositoryPort';

class MockFeedRepositoryPort implements FeedRepositoryPort {
  save(feed: Feed): Promise<Feed> {
    return Promise.resolve(feed);
  }

  saveFeedsBatch(feeds: Feed[]): Promise<Feed[]> {
    return Promise.resolve(feeds);
  }

  findById(): Promise<Feed | null> {
    return Promise.resolve(null);
  }

  findAll(): Promise<Feed[]> {
    return Promise.resolve([]);
  }

  deleteAll(): Promise<void> {
    return Promise.resolve();
  }

  deleteById(): Promise<void> {
    return Promise.resolve();
  }

  updateById(): Promise<Feed | null> {
    return Promise.resolve(null);
  }
}

describe('FeedRepositoryPort', () => {
  let repository: FeedRepositoryPort;

  beforeEach(() => {
    repository = new MockFeedRepositoryPort();
  });

  it('should save a feed', async () => {
    const feed = new Feed('title', 'description', 'author', 'journal', 'link');
    const result = await repository.save(feed);
    expect(result).toEqual(feed);
  });

  it('should save a batch of feeds', async () => {
    const feeds = [
      new Feed('title1', 'description1', 'author1', 'journal1', 'link1'),
      new Feed('title2', 'description2', 'author2', 'journal2', 'link2'),
    ];
    const result = await repository.saveFeedsBatch(feeds);
    expect(result).toEqual(feeds);
  });

  it('should find a feed by id', async () => {
    const result = await repository.findById('1');
    expect(result).toBeNull();
  });

  it('should find all feeds within a date range', async () => {
    const result = await repository.findAll(new Date(), new Date());
    expect(result).toEqual([]);
  });

  it('should delete a feed by id', async () => {
    await expect(repository.deleteById('1')).resolves.toBeUndefined();
  });

  it('should update a feed by id', async () => {
    const feed = new Feed('title', 'description', 'author', 'journal', 'link');
    const result = await repository.updateById('1', feed);
    expect(result).toBeNull();
  });
});
