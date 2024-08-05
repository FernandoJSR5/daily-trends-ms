import { Feed } from '../../../src/domain/entities/Feed';
import { FeedMapper } from '../../../src/infrastructure/mappers/FeedMapper';
import { FeedModel, IFeed } from '../../../src/infrastructure/models/FeedModel';
import { FeedRepository } from '../../../src/infrastructure/repositories/FeedRepository';

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

jest.mock('../../../src/infrastructure/models/FeedModel');

describe('FeedRepository', () => {
  let feedRepository: FeedRepository;

  beforeEach(() => {
    feedRepository = new FeedRepository();
  });

  it('should save a batch of feeds', async () => {
    const feeds = [
      new Feed(
        'Title 1',
        'Description 1',
        'Author 1',
        'Journal 1',
        'http://example1.com',
      ),
      new Feed(
        'Title 2',
        'Description 2',
        'Author 2',
        'Journal 2',
        'http://example2.com',
      ),
    ];

    const feedModels = feeds.map((feed) =>
      createMockFeed({
        title: feed.title,
        link: feed.link,
        description: feed.description,
        author: feed.author,
        journal: feed.journal,
      }),
    );

    FeedMapper.toModelArray = jest.fn().mockReturnValue(feedModels);
    FeedModel.insertMany = jest.fn().mockResolvedValue(
      feedModels.map((model) => ({
        ...model,
        _id: 'mockId',
        __v: 0,
      })),
    );

    FeedMapper.toDomainArray = jest
      .fn()
      .mockReturnValue(feedModels.map((model) => FeedMapper.toDomain(model)));

    const result = await feedRepository.saveFeedsBatch(feeds);

    expect(result).toEqual(FeedMapper.toDomainArray(feedModels));
    expect(FeedMapper.toModelArray).toHaveBeenCalledWith(feeds);
    expect(FeedModel.insertMany).toHaveBeenCalledWith(feedModels);
  });

  it('should find a feed by ID', async () => {
    const id = 'mockId';
    const feedModel = createMockFeed({ _id: id });

    FeedModel.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(feedModel),
    });

    FeedMapper.toDomain = jest
      .fn()
      .mockReturnValue(FeedMapper.toDomain(feedModel));

    const result = await feedRepository.findById(id);

    expect(result).toEqual(FeedMapper.toDomain(feedModel));
    expect(FeedModel.findById).toHaveBeenCalledWith(id);
  });

  it('should delete a feed by ID', async () => {
    const id = 'mockId';
    const feedModel = createMockFeed({ _id: id });

    FeedModel.findByIdAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(feedModel),
    });

    await feedRepository.deleteById(id);

    expect(FeedModel.findByIdAndDelete).toHaveBeenCalledWith(id);
  });

  it('should find all feeds within a date range', async () => {
    const startDate = new Date('2024-08-01T00:00:00Z');
    const endDate = new Date('2024-08-02T00:00:00Z');

    const feedModels = [
      createMockFeed({
        updatedAt: new Date('2024-08-01T12:00:00Z'),
      }),
    ];

    FeedModel.find = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(feedModels),
    });

    FeedMapper.toDomainArray = jest
      .fn()
      .mockReturnValue(feedModels.map(FeedMapper.toDomain));

    const result = await feedRepository.findAll(startDate, endDate);

    expect(result).toEqual(FeedMapper.toDomainArray(feedModels));
    expect(FeedModel.find).toHaveBeenCalledWith({
      updatedAt: { $gte: startDate, $lt: endDate },
    });
  });

  it('should save a single feed', async () => {
    const feed = new Feed(
      'Title',
      'Description',
      'Author',
      'Journal',
      'http://example.com',
    );

    const feedModel = createMockFeed({
      title: feed.title,
      link: feed.link,
      description: feed.description,
      author: feed.author,
      journal: feed.journal,
    });

    FeedMapper.toModel = jest.fn().mockReturnValue(feedModel);
    FeedModel.prototype.save = jest.fn().mockResolvedValue(feedModel);

    const result = await feedRepository.save(feed);

    expect(result).toEqual(FeedMapper.toDomain(feedModel));
    expect(FeedMapper.toModel).toHaveBeenCalledWith(feed);
  });

  it('should update a feed by ID', async () => {
    const id = 'mockId';
    const feed = new Feed(
      'Title',
      'Description',
      'Author',
      'Journal',
      'http://example.com',
    );

    const updatedFeedModel = createMockFeed({
      _id: id,
      title: feed.title,
      link: feed.link,
      description: feed.description,
      author: feed.author,
      journal: feed.journal,
    });

    FeedModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(updatedFeedModel),
    });

    FeedMapper.toDomain = jest
      .fn()
      .mockReturnValue(FeedMapper.toDomain(updatedFeedModel));

    const result = await feedRepository.updateById(id, feed);

    expect(result).toEqual(FeedMapper.toDomain(updatedFeedModel));

    const expectedModel = FeedMapper.toModel(feed);
    expect(FeedModel.findByIdAndUpdate).toHaveBeenCalledWith(
      id,
      expect.objectContaining({
        title: expectedModel.title,
        link: expectedModel.link,
        description: expectedModel.description,
        author: expectedModel.author,
        journal: expectedModel.journal,
        updatedAt: expect.any(Date),
      }),
      { new: true },
    );
  });
});
