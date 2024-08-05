import { FeedBuilder } from '../../domain/builders/FeedBuilder';
import { Feed } from '../../domain/entities/Feed';
import { IFeed } from '../models/FeedModel';

export class FeedMapper {
  public static toDomain(feedModel: IFeed): Feed {
    return new FeedBuilder()
      .setTitle(feedModel.title || '')
      .setDescription(feedModel.description || '')
      .setAuthor(feedModel.author || '')
      .setJournal(feedModel.journal || '')
      .setLink(feedModel.link || '')
      .build();
  }

  public static toModel(feed: Feed): Feed {
    return {
      title: feed.title,
      link: feed.link,
      description: feed.description,
      author: feed.author,
      journal: feed.journal,
      updatedAt: new Date(),
    } as Feed;
  }

  public static toDomainArray(feedModels: IFeed[]): Feed[] {
    return feedModels.map(this.toDomain);
  }

  public static toModelArray(feeds: Feed[]): Feed[] {
    return feeds.map(this.toModel);
  }
}
