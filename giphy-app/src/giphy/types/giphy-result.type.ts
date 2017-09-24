import { Giph } from './giph.result';

export type GiphyResult = Readonly<{
  data: Giph [],
  pagination: {
    count: number,
    offset: number,
    total_count: number
  }
}>;
