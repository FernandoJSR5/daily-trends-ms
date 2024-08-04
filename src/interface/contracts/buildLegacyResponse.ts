import { Feed } from '../../domain/entities/Feed';
import { LegacyResponse } from './LegacyResponse';

interface BuildLegacyResponseArgs {
  status: number;
  description: string;
  data?: Feed[] | Feed | null;
}

function buildLegacyResponse({
  description,
  data,
  status,
}: BuildLegacyResponseArgs): LegacyResponse {
  return {
    status,
    description,
    data: data ?? undefined,
  };
}

export default buildLegacyResponse;
