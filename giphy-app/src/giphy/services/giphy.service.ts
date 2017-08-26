import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GiphyResult } from '../types/giphy-result.type';

@Injectable()
export class GiphyService {
  constructor(private httpClient: HttpClient) {

  }

  fetchGifs(term: string): Observable<GiphyResult> {
    return this.httpClient.get(`https://api.giphy.com/v1/gifs/search?q=${term}&api_key=dc6zaTOxFJmzC`);
  }
}
