import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GiphyResult } from '../types/giphy-result.type';

@Injectable()
export class GiphyService {
  constructor(private httpClient: HttpClient) {

  }

  fetchGifs(term: string, offset: number = 0): Observable<GiphyResult> {
      return this.httpClient.get(`https://api.giphy.com/v1/gifs/search?q=${term}&offset=${offset}&limit=50&api_key=dc6zaTOxFJmzC`);
  }
}
