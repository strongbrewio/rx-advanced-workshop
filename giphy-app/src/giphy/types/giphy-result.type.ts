import { Giph } from './giph.result';

export interface GiphyResult {
  data: Giph [];
  pagination: {
    count: number,
    offset: number,
    total_count: number
  };
}
