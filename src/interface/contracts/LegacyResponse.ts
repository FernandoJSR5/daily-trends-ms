import { Feed } from '../../domain/entities/Feed';

export interface LegacyResponse<T = Feed | Feed[]> {
  status: number;
  description?: string;
  data?: T;
}
