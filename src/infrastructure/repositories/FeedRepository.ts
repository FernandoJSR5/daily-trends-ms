import { Feed } from '../../domain/entities/Feed';
import { FeedRepositoryPort } from '../../domain/ports/FeedRepositoryPort';
import { FeedMapper } from '../mappers/FeedMapper';
import { FeedModel } from '../models/FeedModel';

export class FeedRepository implements FeedRepositoryPort {
  public async saveFeedsBatch(feeds: Feed[]): Promise<Feed[]> {
    try {
      const feedModels = FeedMapper.toModelArray(feeds);
      const savedFeeds = await FeedModel.insertMany(feedModels);
      console.log(`Successfully saved ${feeds.length} feeds to the database.`);
      return FeedMapper.toDomainArray(savedFeeds);
    } catch (error) {
      console.error(`Error saving feeds to the database:`, error);
      throw error;
    }
  }

  public async findById(id: string): Promise<Feed | null> {
    try {
      const feedModel = await FeedModel.findById(id).exec();
      return feedModel ? FeedMapper.toDomain(feedModel) : null;
    } catch (error) {
      console.error(`Error fetching feed by ID:`, error);
      throw new Error('Could not fetch feed at this time');
    }
  }

  public async deleteById(id: string): Promise<void> {
  try {
    const result = await FeedModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new Error(`Feed with ID ${id} not found`);
    }

    console.log(`Successfully deleted feed with ID ${id}`);
  } catch (error) {
    console.error(`Error deleting feed by ID:`, error);
    throw new Error(`Could not delete feed at this time: ${error.message || error}`);
  }
}


  public async findAll(startDate: Date, endDate: Date): Promise<Feed[]> {
    try {
      if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
        throw new Error('Invalid date parameters');
      }

      if (startDate > endDate) {
        throw new Error('Start date cannot be after end date');
      }

      const feedModels = await FeedModel.find({
        updatedAt: {
          $gte: startDate,
          $lt: endDate,
        },
      }).exec();

      return FeedMapper.toDomainArray(feedModels);
    } catch (error) {
      console.error('Error fetching feeds:', error);
      throw new Error('Could not fetch feeds at this time');
    }
  }

  public async save(feed: Feed): Promise<Feed> {
    try {
      const feedModel = new FeedModel(FeedMapper.toModel(feed));
      const savedFeed = await feedModel.save();
      return FeedMapper.toDomain(savedFeed);
    } catch (error) {
      console.error('Error saving feed:', error);
      throw new Error('Could not save feed at this time');
    }
  }

  public async deleteAll(): Promise<void> {
    try {
      await FeedModel.deleteMany().exec();
    } catch (error) {
      console.error('Error deleting all feeds:', error);
      throw new Error('Could not delete feeds at this time');
    }
  }

  public async updateById(id: string, feed: Feed): Promise<Feed | null> {
    try {
      const updatedFeedModel = await FeedModel.findByIdAndUpdate(
        id,
        FeedMapper.toModel(feed),
        { new: true }
      ).exec();

      if (!updatedFeedModel) {
        throw new Error(`Feed with ID ${id} not found`);
      }

      console.log(`Successfully updated feed with ID ${id}`);
      return FeedMapper.toDomain(updatedFeedModel);
    } catch (error) {
      console.error(`Error updating feed by ID:`, error);
      throw new Error(`Could not update feed at this time: ${error.message || error}`);
    }
  }
  
}
