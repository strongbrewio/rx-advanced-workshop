import { Giph } from './giph.result';

export type GiphyResult = {
  data: Giph [],
  pagination: {
    count: number,
    offset: number,
    total_count: number
  }
}
