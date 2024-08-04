import { IFeed } from '../../infrastructure/models/FeedModel';

export interface ApiResponse<T = IFeed[]> {
  status: 'success';
  description?: string;
  data?: T;
}
