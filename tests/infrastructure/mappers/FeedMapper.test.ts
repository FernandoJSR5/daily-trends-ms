import { FeedBuilder } from '../../../src/domain/builders/FeedBuilder';
import { Feed } from '../../../src/domain/entities/Feed';
import { FeedMapper } from '../../../src/infrastructure/mappers/FeedMapper';
import { IFeed } from '../../../src/infrastructure/models/FeedModel';

describe('FeedMapper', () => {
  const createMockFeed = (overrides: Partial<IFeed> = {}): IFeed => {
    return {
      title: 'Title',
      link: 'http://example.com',
      description: 'Description',
      author: 'Author',
      journal: 'Journal',
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: 'mockId',
      __v: 0,
      $assertPopulated: jest.fn(),
      $clone: jest.fn(),
      $getAllSubdocs: jest.fn(),
      $ignore: jest.fn(),
      ...overrides,
    } as unknown as IFeed;
  };

  it('should map IFeed to Feed', () => {
    const feedModel = createMockFeed({
      title: 'Test Title',
      link: 'http://example.com',
      description: 'Test Description',
      author: 'Test Author',
      journal: 'Test Journal',
    });

    const feed = FeedMapper.toDomain(feedModel);

    expect(feed).toBeInstanceOf(Feed);
    expect(feed.title).toBe(feedModel.title);
    expect(feed.link).toBe(feedModel.link);
    expect(feed.description).toBe(feedModel.description);
    expect(feed.author).toBe(feedModel.author);
    expect(feed.journal).toBe(feedModel.journal);
  });

  it('should map Feed to IFeed', () => {
    const feed = new FeedBuilder()
      .setTitle('Test Title')
      .setDescription('Test Description')
      .setAuthor('Test Author')
      .setJournal('Test Journal')
      .setLink('http://example.com')
      .build();

    const feedModel = FeedMapper.toModel(feed);

    expect(feedModel).toMatchObject({
      title: feed.title,
      link: feed.link,
      description: feed.description,
      author: feed.author,
      journal: feed.journal,
      updatedAt: expect.any(Date),
    });
  });

  it('should map an array of IFeed to an array of Feed', () => {
    const feedModels: IFeed[] = [
      createMockFeed({
        title: 'Title 1',
        link: 'http://example1.com',
        description: 'Description 1',
        author: 'Author 1',
        journal: 'Journal 1',
      }),
      createMockFeed({
        title: 'Title 2',
        link: 'http://example2.com',
        description: 'Description 2',
        author: 'Author 2',
        journal: 'Journal 2',
      }),
    ];

    const feeds = FeedMapper.toDomainArray(feedModels);

    expect(feeds).toHaveLength(feedModels.length);
    expect(feeds[0]).toBeInstanceOf(Feed);
    expect(feeds[0].title).toBe(feedModels[0].title);
    expect(feeds[1].link).toBe(feedModels[1].link);
  });

  it('should map an array of Feed to an array of IFeed', () => {
    const feeds: Feed[] = [
      new FeedBuilder()
        .setTitle('Title 1')
        .setDescription('Description 1')
        .setAuthor('Author 1')
        .setJournal('Journal 1')
        .setLink('http://example1.com')
        .build(),
      new FeedBuilder()
        .setTitle('Title 2')
        .setDescription('Description 2')
        .setAuthor('Author 2')
        .setJournal('Journal 2')
        .setLink('http://example2.com')
        .build(),
    ];

    const feedModels = FeedMapper.toModelArray(feeds);

    expect(feedModels).toHaveLength(feeds.length);
    expect(feedModels[0]).toMatchObject({
      title: feeds[0].title,
      link: feeds[0].link,
      description: feeds[0].description,
      author: feeds[0].author,
      journal: feeds[0].journal,
      updatedAt: expect.any(Date),
    });
  });
});
