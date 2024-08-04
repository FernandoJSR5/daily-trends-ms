/* eslint-disable @typescript-eslint/no-explicit-any */
import { FeedUseCases } from 'application/use-cases/FeedUseCases';
import { Feed } from 'domain/entities/Feed';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { FeedBuilder } from '../../domain/builders/FeedBuilder';
import logger from '../../settings/logger';
import buildLegacyResponse from '../contracts/buildLegacyResponse';

const getElapsedTime = (startTime: number): number => Date.now() - startTime;

const logEvent = (
  loggerInstance: any,
  action: string,
  startTime: number,
  message: string,
  data?: any,
  status?: number
): void => {
  loggerInstance.info({
    message,
    result: data,
    responseTimeMS: getElapsedTime(startTime),
    status,
  });
};

class FeedController {
  constructor(private feedUseCases: FeedUseCases) {}

  async getFeeds(req: Request, res: Response): Promise<Response> {
    const action = 'find feeds';
    const start = Date.now();

    const childLogger = logger.child({
      trackId: uuid(),
      action,
    });

    try {
      const feeds = await this.feedUseCases.getFeeds();

      logEvent(childLogger, action, start, 'Feeds retrieved successfully', feeds, 200);

      return res.status(200).json(
        buildLegacyResponse({
          status: 200,
          description: 'Feeds delivered successfully',
          data: feeds,
        })
      );
    } catch (error) {
      logEvent(
        childLogger,
        action,
        start,
        `Failed to retrieve feeds: ${error.message || error}`,
        undefined,
        500
      );

      return res.status(500).json(
        buildLegacyResponse({
          status: 500,
          description: error.message || 'An error occurred',
        })
      );
    }
  }

  async newFeed(req: Request, res: Response): Promise<Response> {
    const body = req.body as Feed;
    const action = 'save feed';
    const start = Date.now();

    const childLogger = logger.child({
      trackId: uuid(),
      action,
      body,
    });

    const feed = new FeedBuilder()
      .setTitle(body.title)
      .setAuthor(body.author)
      .setDescription(body.description)
      .setJournal(body.journal)
      .setLink(body.link)
      .build();

    try {
      const data = await this.feedUseCases.saveFeed(feed);

      logEvent(
        childLogger,
        action,
        start,
        'Feed was saved in database successfully',
        data,
        200
      );

      return res.status(200).json(
        buildLegacyResponse({
          status: 200,
          description: 'Feed was created successfully',
          data,
        })
      );
    } catch (error) {
      logEvent(
        childLogger,
        action,
        start,
        `Feed was not saved in database. ${error.message || error}`,
        undefined,
        500
      );

      return res.status(500).json(
        buildLegacyResponse({
          status: 500,
          description: error.message || 'An error occurred',
        })
      );
    }
  }

  async updateFeed(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const body = req.body as Feed;
    const action = 'update feed';
    const start = Date.now();

    const childLogger = logger.child({
      trackId: uuid(),
      action,
      id,
      body,
    });

    try {
      
      const existingFeed = await this.feedUseCases.findFeedById(id);

      if (!existingFeed) {
        logEvent(childLogger, action, start, `Feed with ID ${id} not found`, undefined, 404);
        return res.status(404).json(
          buildLegacyResponse({
            status: 404,
            description: 'Feed not found',
          })
        );
      }

      const feed = new FeedBuilder()
        .setTitle(body.title)
        .setAuthor(body.author)
        .setDescription(body.description)
        .setJournal(body.journal)
        .setLink(body.link)
        .build();

      const updatedFeed = await this.feedUseCases.updateFeed(id, feed);

      logEvent(
        childLogger,
        action,
        start,
        'Feed updated successfully',
        updatedFeed,
        200
      );

      return res.status(200).json(
        buildLegacyResponse({
          status: 200,
          description: 'Feed was updated successfully',
          data: updatedFeed ?? undefined,
        })
      );
    } catch (error) {
      logEvent(
        childLogger,
        action,
        start,
        `Failed to update feed: ${error.message || error}`,
        undefined,
        500
      );

      return res.status(500).json(
        buildLegacyResponse({
          status: 500,
          description: error.message || 'An error occurred',
        })
      );
    }
  }

  async getFeedById(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    const action = 'find feed by ID';
    const start = Date.now();

    const childLogger = logger.child({
      trackId: uuid(),
      action,
      id,
    });

    try {
      const feed = await this.feedUseCases.findFeedById(id);

      if (!feed) {
        logEvent(
          childLogger,
          action,
          start,
          `Feed with ID ${id} not found`,
          undefined,
          404
        );

        return res.status(404).json(
          buildLegacyResponse({
            status: 404,
            description: `Feed with ID ${id} not found`,
          })
        );
      }

      logEvent(
        childLogger,
        action,
        start,
        'Feed retrieved successfully',
        feed,
        200
      );

      return res.status(200).json(
        buildLegacyResponse({
          status: 200,
          description: 'Feed retrieved successfully',
          data: feed,
        })
      );
    } catch (error) {
      logEvent(
        childLogger,
        action,
        start,
        `Failed to retrieve feed by ID: ${error.message || error}`,
        undefined,
        500
      );

      return res.status(500).json(
        buildLegacyResponse({
          status: 500,
          description: error.message || 'An error occurred',
        })
      );
    }
  }

  async deleteFeed(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    const action = 'delete feed';
    const start = Date.now();

    const childLogger = logger.child({
      trackId: uuid(),
      action,
      id,
    });

    try {
      const existingFeed = await this.feedUseCases.findFeedById(id);

      if (!existingFeed) {
        logEvent(childLogger, action, start, `Feed with ID ${id} not found`, undefined, 404);
        return res.status(404).json(
          buildLegacyResponse({
            status: 404,
            description: 'Feed not found',
          })
        );
      }

      await this.feedUseCases.deleteFeedById(id);

      logEvent(
        childLogger,
        action,
        start,
        'Feed deleted successfully',
        undefined,
        200
      );

      return res.status(200).json(
        buildLegacyResponse({
          status: 200,
          description: 'Feed deleted successfully',
        })
      );
    } catch (error) {
      logEvent(
        childLogger,
        action,
        start,
        `Failed to delete feed: ${error.message || error}`,
        undefined,
        500
      );

      return res.status(500).json(
        buildLegacyResponse({
          status: 500,
          description: error.message || 'An error occurred',
        })
      );
    }
  }

}

export default FeedController;
