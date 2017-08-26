import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { GiphyService } from '../../services/giphy.service';
import 'rxjs/add/operator/mergeMap';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/combineLatest';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { GiphyResult } from '../../types/giphy-result.type';
import { Giph } from '../../types/giph.result';

@Component({
  selector: 'index-page',
  styleUrls: ['./index-page.container.less'],
  template: `
    <topbar [account]="account$|async" (loadRandomGifs)="onLoadRandomGifs()"
            (search)="searchTerm$.next($event)"></topbar>
    <div class="main">
      <sidebar>
        <category-picker [categories]="categories" [currentCategory]="currentCategory$|async"></category-picker>
        <giphy-filter [maxHeight]="maxHeight$|async" [maxWidth]="maxWidth$|async"
                      (setMaxHeight)="maxHeight$.next($event)"
                      (setMaxWidth)="maxWidth$.next($event)"></giphy-filter>
      </sidebar>
      <giphy-overview [giphs]="filteredGiphs$|async"></giphy-overview>
    </div>
    <spinner [spin]="false"></spinner>
  `
})
export class IndexPageContainer {
  account$ = this.authenticationService.authenticate();
  searchTerm$ = new Subject();
  randomWord$ = new Subject();
  maxWidth$ = new BehaviorSubject(500);
  maxHeight$ = new BehaviorSubject(500);
  randomWords = ['derp', 'cat', 'shizzle', 'whatever', 'elephant', 'chair'];
  categories = [
    { label: 'omg', value: 'omg' },
    { label: 'wtf', value: 'wtf' },
    { label: 'fml', value: 'fml' },
    { label: 'awesome', value: 'awesome' },
  ];
  currentCategory$ = this.activatedRoute.params.map(item => item.category);

  giphyResult$ = this.account$
    .flatMap(() => this.currentCategory$.merge(this.searchTerm$, this.randomWord$))
    .debounceTime(200)
    .switchMap((cat: string) => this.giphyService.fetchGifs(cat));

  filteredGiphs$ = Observable.combineLatest([this.maxWidth$, this.maxHeight$, this.giphyResult$], this.filterData);

  constructor(private authenticationService: AuthenticationService,
              private giphyService: GiphyService,
              private activatedRoute: ActivatedRoute) {

  }

  onLoadRandomGifs(): void {
    const randomNr = Math.floor(Math.random() * ( 1 + this.randomWords.length - 1 )) + 0;
    this.randomWord$.next(this.randomWords[randomNr]);
  }

  private filterData(maxWidth: number, maxHeight: number, giphyResult: GiphyResult): Giph[] {
    return giphyResult.data.filter(image => Number(image.images.original.width) < Number(maxWidth) &&
      Number(image.images.original.height) < Number(maxHeight));
  }
}
