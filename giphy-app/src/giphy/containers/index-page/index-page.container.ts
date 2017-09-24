import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {GiphyService} from '../../services/giphy.service';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {GiphyResult} from '../../types/giphy-result.type';
import {Giph} from '../../types/giph.result';
import {GiphyOverviewComponent} from '../../components/giphy-overview/giphy-overview.component';

@Component({
  selector: 'index-page',
  styleUrls: ['./index-page.container.less'],
  template: `
    <topbar [account]="account$|async" (loadRandomGifs)="onLoadRandomGifs()"
            (search)="searchTerm$.next($event)"></topbar>
    <div class="main">
      <sidebar>
        <category-picker [categories]="categories" [currentCategory]="currentCategory$|async"></category-picker>
        <giphy-filter [maxHeight]="maxHeight$|async"
                      [maxWidth]="maxWidth$|async"
                      (setMaxHeight)="maxHeight$.next($event)"
                      (setMaxWidth)="maxWidth$.next($event)"></giphy-filter>
      </sidebar>
      <giphy-overview [loading]="loading$|async"
                      [giphs]="filteredGiphs$|async"></giphy-overview>
    </div>
  `
})
// TODO: add virtual scroll
// TODO: add caching to the virtual scroll
export class IndexPageContainer implements OnInit, AfterViewInit {
  @ViewChild(GiphyOverviewComponent, {read: ElementRef})
  giphyOverviewElementRef: ElementRef;

  PAGE_LIMIT = 20;

  account$ = this.authenticationService.authenticate();

  fetchData$ = new Subject();
  searchTerm$ = new Subject();
  randomWord$ = new Subject();
  maxWidth$ = new BehaviorSubject(500);
  maxHeight$ = new BehaviorSubject(500);
  randomWords = ['derp', 'cat', 'shizzle', 'whatever', 'elephant', 'chair'];
  categories = [
    {label: 'omg', value: 'omg'},
    {label: 'wtf', value: 'wtf'},
    {label: 'fml', value: 'fml'},
    {label: 'awesome', value: 'awesome'},
  ];
  currentCategory$ = this.activatedRoute.params.map(item => item.category);

  private trigger$ = this.account$
    .mergeMap(() => this.currentCategory$.merge(this.searchTerm$, this.randomWord$))
    .debounceTime(200);

  giphyResult$ = this.trigger$
    .switchMap((cat: string) => this.giphyService.fetchGifs(cat));


  filteredGiphs$;
  loading$ = this.trigger$.mapTo(true).merge(this.giphyResult$.mapTo(false));

  constructor(private authenticationService: AuthenticationService,
              private giphyService: GiphyService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
  }

  onLoadRandomGifs(): void {
    const randomNr = Math.floor(Math.random() * ( 1 + this.randomWords.length - 1 )) + 0;
    this.randomWord$.next(this.randomWords[randomNr]);
  }

  ngAfterViewInit() {
    // If the user scrolled till 250px of the end, we want to load new data
    const hasScrolledTowardsTheEnd = (scrollTop) => {
      return scrollTop + this.giphyOverviewElementRef.nativeElement.clientHeight + 250
        >= this.giphyOverviewElementRef.nativeElement.scrollHeight;
    };

    // @formatter:off
    // fromEvent:   ---s-s---s----s-----s-----     s = scrollEvent
    //                    -map-
    //              -----t---t----t-----t-----     t = scrollTop from event
    //                    -debounceTime-
    //              -----t---t----t-----t-----     t = scrollTop from event
    //                    -filter-
    //              --------------t-----t-----     t = scrollTop from event
    //                    -mapTo-
    //              --------------e-----e-----     e = next Page event
    // @formatter:on

    const scrollPage$ = Observable.fromEvent(this.giphyOverviewElementRef.nativeElement, 'scroll')
      .map(_ => this.giphyOverviewElementRef.nativeElement.scrollTop)
      .debounceTime(200)
      .filter(hasScrolledTowardsTheEnd)
      .mapTo({type: 'NEXT_PAGE'});

    // @formatter:off
    // trigger$:       ---------t-------  t = trigger update
    //                    -mapTo-
    // triggerReset$:  ---------r-------  r = reset page event
    // @formatter:on
    const triggerReset$ = this.trigger$
      .mapTo({type: 'RESET_PAGE'});

    // @formatter:off
    // scrollPage$:        ----s-------s--s-- s = scroll page event
    //
    // @formatter:on
    const page$: Observable<number> =
      Observable.merge(scrollPage$, triggerReset$)
        .scan((acc: number, current: { type: string }) => {
          if (current.type === 'NEXT_PAGE') {
            return ++acc;
          } else if (current.type = 'RESET_PAGE') {
            return 0;
          }
        }, 0)
        .startWith(0);

    const dataByPage$ =
      Observable.combineLatest(page$, this.trigger$, (page, trigger) => this.giphyService.fetchGifs(trigger, page * this.PAGE_LIMIT))
        .switch()
        .map((result: GiphyResult) => result.data)
        .scan((acc, value) => [...acc, ...value])
        .do((val) => console.log('data from page', val));

    const dataByTrigger = this.trigger$
      .switchMap((cat: string) => this.giphyService.fetchGifs(cat))
      .map((result: GiphyResult) => result.data);

    const data$ = Observable.merge(dataByPage$, dataByTrigger);

    this.filteredGiphs$ = Observable.combineLatest([this.maxWidth$, this.maxHeight$, data$], this.filterData)
      .do(data => console.log('size', data.length));
  }

  private filterData(maxWidth: number, maxHeight: number, data: Giph[]): Giph[] {
    return data.filter(image => Number(image.images.original.width) < Number(maxWidth) &&
    Number(image.images.original.height) < Number(maxHeight));
  }
}
