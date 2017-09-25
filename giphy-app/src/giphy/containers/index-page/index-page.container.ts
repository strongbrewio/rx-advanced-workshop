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
export class IndexPageContainer implements AfterViewInit {
  @ViewChild(GiphyOverviewComponent, {read: ElementRef})
  giphyOverviewElementRef: ElementRef;

  PAGE_LIMIT = 25;

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

  account$ = this.authenticationService.authenticate();

  filteredGiphs$;
  loading$;

  constructor(private authenticationService: AuthenticationService,
              private giphyService: GiphyService,
              private activatedRoute: ActivatedRoute) {
  }

  onLoadRandomGifs(): void {
    const randomNr = Math.floor(Math.random() * ( 1 + this.randomWords.length - 1 ));
    this.randomWord$.next(this.randomWords[randomNr]);
  }

  ngAfterViewInit() {
    // If the user scrolled till 250px of the end, we want to load new data
    const hasScrolledTowardsTheEnd = (scrollTop) => {
      return scrollTop + this.giphyOverviewElementRef.nativeElement.clientHeight + 250
        >= this.giphyOverviewElementRef.nativeElement.scrollHeight;
    };

    const calculatePage = (acc: number, current: { type: string }) => {
      if (current.type === 'NEXT_PAGE') {
        return ++acc;
      } else if (current.type = 'RESET_PAGE') {
        return 0;
      }
    };

    // TODO: I removed the account stream here since it might be a good example to put this into a
    // guard so people can understand guards in angular. What do you think?
    const query$ = Observable.merge(this.currentCategory$, this.searchTerm$, this.randomWord$)
      .debounceTime(200);

    // @formatter:off
    // fromEvent:   ---s-s---s----s-----s-----     s = scrollEvent
    //                    -map-
    //              ---t-t---t----t-----t-----     t = scrollTop from event
    //                    -debounceTime-
    //              -----t---t----t-----t-----     t = scrollTop from event
    //                    -filter-
    //              --------------t-----t-----     t = scrollTop from event
    //                    -mapTo-
    //              --------------e-----e-----     e = next Page event
    // @formatter:on
    // TODO: how to mock this stream :p
    const scrollPage$ = Observable.fromEvent(this.giphyOverviewElementRef.nativeElement, 'scroll')
      .map(_ => this.giphyOverviewElementRef.nativeElement.scrollTop)
      .debounceTime(200)
      .filter(hasScrolledTowardsTheEnd)
      .mapTo({type: 'NEXT_PAGE'});

    // @formatter:off
    // query$:         ---------t-------  t = trigger update
    //                    -mapTo-
    // triggerReset$:  ---------r-------  r = reset page event
    // @formatter:on
    const triggerReset$ = query$
      .mapTo({type: 'RESET_PAGE'})
      .do(_ => this.giphyOverviewElementRef.nativeElement.scrollTop = 0);

    // @formatter:off
    // scrollPage$:        ----s-------s--s-- s = scroll page event
    // triggerReset$:      -------r---------- r = trigger reset event
    //                        -merge-
    //                     ----s--r----s--s--
    //                        -scan-
    //                     ----1--0----1--2--
    //                        -startWith-
    // page$:              0---1--0----1--2--
    // @formatter:on
    const page$: Observable<number> =
      Observable.merge(scrollPage$, triggerReset$)
        .scan(calculatePage, 0)
        .startWith(0);

    // @formatter:off
    // page$:         0--------1----2------0--
    // query$:        q----q------q-----------
    //                    -combineLatest-
    //                e----e---e--e-e------e--  e = [page, trigger]
    //                    -switchMap-
    //                d----d------d-d------d--  d = data from backend
    //                    -withLatestFrom-
    //                t----t------t-t------t--  t = [data, pageNumber]
    //                    -scan-
    // giphyResult$   1----2------1-2------3--  1 = one set of data,
    //                                          2 = two sets of data,
    //                                          3 = three sets of data
    //                                          (data is reset when page is 0)
    // @formatter:on
    const giphyResult$ =
      page$.combineLatest(query$)
        .switchMap(([page, trigger]) => this.giphyService.fetchGifs(trigger, page * this.PAGE_LIMIT))
        .map((result: GiphyResult) => result.data)
        .withLatestFrom(page$)
        .scan((acc, [data, page]) => page === 0 ? data : [...acc, ...data], []);

    // @formatter:off
    // maxWidth$:         w--------w---------  w = width
    // maxHeight$:        h------------h-----  h = height
    // giphyResult$:      -----d----------d--  d = data
    //                       -combineLatest-
    // filteredGiphs$:    -----f---f---f--f--  f = filtered data
    // @formatter:on
    this.filteredGiphs$ = Observable.combineLatest(this.maxWidth$, this.maxHeight$, giphyResult$, this.filterData);

    this.loading$ = query$.mapTo(true).merge(giphyResult$.mapTo(false));
  }

  private filterData(maxWidth: number, maxHeight: number, data: Giph[]): Giph[] {
    return data.filter(image => Number(image.images.original.width) < Number(maxWidth) &&
    Number(image.images.original.height) < Number(maxHeight));
  }
}
