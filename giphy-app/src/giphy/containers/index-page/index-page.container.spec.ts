import {IndexPageContainer} from './index-page.container';
import {marbles} from 'rxjs-marbles';
import createSpyObj = jasmine.createSpyObj;
import {GiphBuilder} from '../../types/giph.result';
import {GiphyResult} from '../../types/giphy-result.type';
import {Observable} from 'rxjs/Observable';
describe('container: IndexPageContainer', () => {
  let container: IndexPageContainer;
  let authenticationServiceMock;
  let giphyServiceMock;
  let activatedRouteMock;

  beforeEach(() => {
    authenticationServiceMock = {
      authenticate: jest.fn()
    };
    giphyServiceMock = {
      fetchGifs: jest.fn()
    };
    activatedRouteMock = jest.fn();

    container = new IndexPageContainer(
      authenticationServiceMock,
      giphyServiceMock,
      activatedRouteMock);
  });

  describe('on ngAfterViewInit', () => {
    it('should set up the streams for fetching the data with an infinite scroll', marbles((m) => {
      const giph501x501 = GiphBuilder.buildGiph({images: {original: {url: 'test', width: '501', height: '501'}}});
      const giph499x499 = GiphBuilder.buildGiph({images: {original: {url: 'test', width: '499', height: '499'}}});
      const giph499x501 = GiphBuilder.buildGiph({images: {original: {url: 'test', width: '499', height: '501'}}});
      const giph501x499 = GiphBuilder.buildGiph({images: {original: {url: 'test', width: '501', height: '499'}}});
      const giph498x498 = GiphBuilder.buildGiph({images: {original: {url: 'test', width: '498', height: '498'}}});
      const giph502x502 = GiphBuilder.buildGiph({images: {original: {url: 'test', width: '502', height: '502'}}});
      const giph497x497 = GiphBuilder.buildGiph({images: {original: {url: 'test', width: '479', height: '479'}}});
      // const giph501x502 = GiphBuilder.buildGiph({images: {original: {url: 'test', width: '501', height: '502'}}});
      // const giph501x502 = GiphBuilder.buildGiph({images: {original: {url: 'test', width: '501', height: '502'}}});

      const firstResult = {data: [giph501x501, giph499x499, giph499x501, giph501x499]};
      const secondResult = {data: [giph498x498, giph502x502]};
      const thirdResult = {data: [giph497x497]};
      giphyServiceMock.fetchGifs
        .mockImplementationOnce(() => Observable.of(firstResult))
        .mockImplementationOnce(() => Observable.of(secondResult))
        .mockImplementationOnce(() => Observable.of(thirdResult))
        .mockImplementationOnce(() => Observable.of(firstResult))
        .mockImplementationOnce(() => Observable.of(firstResult))
        .mockImplementationOnce(() => Observable.of(firstResult));

      // @formatter:of
      const values = {
        a: {},
        b: {category: 'category'},
        c: 'searchTerm',
        d: 'randomWord',
        e: 500,
        f: 600,
        g: 500,
        h: 600,
        i: [giph499x499],
        j: [giph499x499, giph498x498],
        k: [giph499x499, giph498x498, giph497x497],
        l: [giph499x499],
        m: [giph499x499, giph501x499],
        n: [giph501x501, giph499x499, giph499x501, giph501x499],
        o: true,
        p: false,
      };
      const params$ =                 m.cold('a--------------------------b---------------------', values);
      const searchTerm$ =             m.cold('-------------------------------c-----------------', values);
      const randomWord$ =             m.cold('-----------------------------------d-------------', values);
      const scrollPage$ =             m.cold('----xx-----x----x-----x--------------------------');
      const maxWidth$ =               m.cold('e-----------------------------------------f------', values);
      const maxHeight$ =              m.cold('g----------------------------------------------h-', values);
      const expectedFilteredGiphs =         ('--i----------j----------k----l---l---l----m----n-');
      const loading$ =                      ('o-(op)-------(op)-------(op)-(op)(op)(op)--------')
      // @formatter:on
      const giphyOverviewElementMock = {
        nativeElement: {
          addEventListener: (eventType, listener) => {
            scrollPage$.subscribe(val => {
              listener(val);
            });
          },
          removeEventListener: () => void 0,
          dispatchEvent: () => void 0,
          scrollTopData: [200, 500, 1400, 1800],
          get scrollTop() {
            return this.scrollTopData.splice(0, 1)[0];
          },
          scrollTopSetter: [],
          set scrollTop(val) {
            this.scrollTopSetter.push(val);
          },
          clientHeight: 500,
          scrollHeightDate: [1200, 1200, 2400, 2400],
          get scrollHeight() {
            return this.scrollHeightDate.splice(0, 1)[0];
          }
        }
      };

      activatedRouteMock.params = params$;
      container.giphyOverviewElementRef = giphyOverviewElementMock;
      container.scheduler = m.scheduler;
      container.DEBOUNCE_TIME = 20;
      container.searchTerm$ = searchTerm$ as any;
      container.randomWord$ = randomWord$ as any;
      container.maxHeight$ = maxHeight$ as any;
      container.maxWidth$ = maxWidth$ as any;

      container.ngAfterViewInit();

      m.expect(container.filteredGiphs$).toBeObservable(expectedFilteredGiphs, values);
      m.expect(container.loading$).toBeObservable(loading$, values);
    }));
  });
});
