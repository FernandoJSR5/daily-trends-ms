import bodyParser from 'body-parser';
import express from 'express';
import request from 'supertest';
import { FeedUseCases } from '../../../src/application/use-cases/FeedUseCases';
import { Feed } from '../../../src/domain/entities/Feed';
import buildLegacyResponse from '../../../src/interface/contracts/buildLegacyResponse';
import FeedController from '../../../src/interface/controllers/FeedController';

jest.mock('../../../src/application/use-cases/FeedUseCases');
jest.mock('../../../src/interface/contracts/buildLegacyResponse');

const app = express();
app.use(bodyParser.json());

const mockFeedRepository = {
  save: jest.fn(),
  saveFeedsBatch: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  deleteById: jest.fn(),
  updateById: jest.fn(),
};

const mockScrapingService = {
  scrapeManager: jest.fn(),
};

const feedUseCases = new FeedUseCases(
  mockFeedRepository,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockScrapingService as any,
);
const feedController = new FeedController(feedUseCases);

app.get('/feeds', (req, res) => feedController.getFeeds(req, res));
app.post('/feeds', (req, res) => feedController.newFeed(req, res));
app.put('/feeds/:id', (req, res) => feedController.updateFeed(req, res));
app.get('/feeds/:id', (req, res) => feedController.getFeedById(req, res));
app.delete('/feeds/:id', (req, res) => feedController.deleteFeed(req, res));

describe('FeedController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all feeds', async () => {
    const feeds = [
      new Feed(
        'Title 1',
        'Description 1',
        'Author 1',
        'Journal 1',
        'http://example1.com',
      ),
    ];
    (feedUseCases.getFeeds as jest.Mock).mockResolvedValue(feeds);
    (buildLegacyResponse as jest.Mock).mockReturnValue({
      status: 200,
      description: 'Feeds delivered successfully',
      data: feeds,
    });

    const response = await request(app).get('/feeds');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 200,
      description: 'Feeds delivered successfully',
      data: feeds,
    });
  });

  it('should create a new feed', async () => {
    const feed = new Feed(
      'Title 1',
      'Description 1',
      'Author 1',
      'Journal 1',
      'http://example1.com',
    );
    const savedFeed = { ...feed, id: 'mockId' };
    (feedUseCases.saveFeed as jest.Mock).mockResolvedValue(savedFeed);
    (buildLegacyResponse as jest.Mock).mockReturnValue({
      status: 200,
      description: 'Feed was created successfully',
      data: savedFeed,
    });

    const response = await request(app).post('/feeds').send(feed);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 200,
      description: 'Feed was created successfully',
      data: savedFeed,
    });
  });

  it('should update an existing feed', async () => {
    const feed = new Feed(
      'Title 1',
      'Description 1',
      'Author 1',
      'Journal 1',
      'http://example1.com',
    );
    const updatedFeed = { ...feed, id: 'mockId' };
    (feedUseCases.findFeedById as jest.Mock).mockResolvedValue(feed);
    (feedUseCases.updateFeed as jest.Mock).mockResolvedValue(updatedFeed);
    (buildLegacyResponse as jest.Mock).mockReturnValue({
      status: 200,
      description: 'Feed was updated successfully',
      data: updatedFeed,
    });

    const response = await request(app).put('/feeds/mockId').send(feed);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 200,
      description: 'Feed was updated successfully',
      data: updatedFeed,
    });
  });

  it('should get a feed by ID', async () => {
    const feed = new Feed(
      'Title 1',
      'Description 1',
      'Author 1',
      'Journal 1',
      'http://example1.com',
    );
    (feedUseCases.findFeedById as jest.Mock).mockResolvedValue(feed);
    (buildLegacyResponse as jest.Mock).mockReturnValue({
      status: 200,
      description: 'Feed retrieved successfully',
      data: feed,
    });

    const response = await request(app).get('/feeds/mockId');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 200,
      description: 'Feed retrieved successfully',
      data: feed,
    });
  });

  it('should delete a feed by ID', async () => {
    (feedUseCases.findFeedById as jest.Mock).mockResolvedValue(
      new Feed(
        'Title 1',
        'Description 1',
        'Author 1',
        'Journal 1',
        'http://example1.com',
      ),
    );
    (feedUseCases.deleteFeedById as jest.Mock).mockResolvedValue(undefined);
    (buildLegacyResponse as jest.Mock).mockReturnValue({
      status: 200,
      description: 'Feed deleted successfully',
    });

    const response = await request(app).delete('/feeds/mockId');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 200,
      description: 'Feed deleted successfully',
    });
  });

  it('should return 404 if feed not found by ID', async () => {
    (feedUseCases.findFeedById as jest.Mock).mockResolvedValue(null);
    (buildLegacyResponse as jest.Mock).mockReturnValue({
      status: 404,
      description: 'Feed not found',
    });

    const response = await request(app).get('/feeds/nonExistingId');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 404,
      description: 'Feed not found',
    });
  });

  it('should return 404 if feed to update is not found by ID', async () => {
    const feed = new Feed(
      'Title 1',
      'Description 1',
      'Author 1',
      'Journal 1',
      'http://example1.com',
    );
    (feedUseCases.findFeedById as jest.Mock).mockResolvedValue(null);
    (buildLegacyResponse as jest.Mock).mockReturnValue({
      status: 404,
      description: 'Feed not found',
    });

    const response = await request(app).put('/feeds/nonExistingId').send(feed);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 404,
      description: 'Feed not found',
    });
  });

  it('should return 404 if feed to delete is not found by ID', async () => {
    (feedUseCases.findFeedById as jest.Mock).mockResolvedValue(null);
    (buildLegacyResponse as jest.Mock).mockReturnValue({
      status: 404,
      description: 'Feed not found',
    });

    const response = await request(app).delete('/feeds/nonExistingId');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 404,
      description: 'Feed not found',
    });
  });

  it('should return 500 if an error occurs while getting all feeds', async () => {
    (feedUseCases.getFeeds as jest.Mock).mockRejectedValue(
      new Error('Internal Server Error'),
    );
    (buildLegacyResponse as jest.Mock).mockReturnValue({
      status: 500,
      description: 'Internal Server Error',
    });

    const response = await request(app).get('/feeds');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: 500,
      description: 'Internal Server Error',
    });
  });

  it('should return 500 if an error occurs while creating a new feed', async () => {
    const feed = new Feed(
      'Title 1',
      'Description 1',
      'Author 1',
      'Journal 1',
      'http://example1.com',
    );
    (feedUseCases.saveFeed as jest.Mock).mockRejectedValue(
      new Error('Internal Server Error'),
    );
    (buildLegacyResponse as jest.Mock).mockReturnValue({
      status: 500,
      description: 'Internal Server Error',
    });

    const response = await request(app).post('/feeds').send(feed);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: 500,
      description: 'Internal Server Error',
    });
  });

  it('should return 500 if an error occurs while updating a feed', async () => {
    const feed = new Feed(
      'Title 1',
      'Description 1',
      'Author 1',
      'Journal 1',
      'http://example1.com',
    );
    (feedUseCases.findFeedById as jest.Mock).mockResolvedValue(feed);
    (feedUseCases.updateFeed as jest.Mock).mockRejectedValue(
      new Error('Internal Server Error'),
    );
    (buildLegacyResponse as jest.Mock).mockReturnValue({
      status: 500,
      description: 'Internal Server Error',
    });

    const response = await request(app).put('/feeds/mockId').send(feed);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: 500,
      description: 'Internal Server Error',
    });
  });

  it('should return 500 if an error occurs while deleting a feed', async () => {
    const feed = new Feed(
      'Title 1',
      'Description 1',
      'Author 1',
      'Journal 1',
      'http://example1.com',
    );
    (feedUseCases.findFeedById as jest.Mock).mockResolvedValue(feed);
    (feedUseCases.deleteFeedById as jest.Mock).mockRejectedValue(
      new Error('Internal Server Error'),
    );
    (buildLegacyResponse as jest.Mock).mockReturnValue({
      status: 500,
      description: 'Internal Server Error',
    });

    const response = await request(app).delete('/feeds/mockId').send(feed);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: 500,
      description: 'Internal Server Error',
    });
  });

  it('should return 500 if an error occurs while getting a feed', async () => {
    const feed = new Feed(
      'Title 1',
      'Description 1',
      'Author 1',
      'Journal 1',
      'http://example1.com',
    );
    (feedUseCases.findFeedById as jest.Mock).mockRejectedValue(
      new Error('Internal Server Error'),
    );
    (buildLegacyResponse as jest.Mock).mockReturnValue({
      status: 500,
      description: 'Internal Server Error',
    });

    const response = await request(app).get('/feeds/mockId').send(feed);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: 500,
      description: 'Internal Server Error',
    });
  });
});
