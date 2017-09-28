import {IndexPageContainer} from './index-page.container';
import {marbles} from 'rxjs-marbles';
import createSpyObj = jasmine.createSpyObj;
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
      // @formatter:off
      const values = {
        a: {item: {category: 'category'}},
        b: 'searchTerm',
        c: 'randomWord'
      };
      const params$ =                 m.cold('----a----------------', values);
      const searchTerm$ =             m.cold('-----------b---------', values);
      const randomWord$ =             m.cold('---------------c-----', values);
      const scroll$ =                 m.cold('-------x------x');

      const expectedFilteredGiphs =         ('---d-----');
      // @formatter:on

      activatedRouteMock.params = params$;

      const giphyOverviewElementMock = {
        nativeElement: {
          addEventListener: (eventType, listener) => {
              scroll$.subscribe(val => {
                listener(val);
              });
          },
          removeEventListener: () => void 0,
          dispatchEvent: () => void 0,
          get scrollTop() {
            const data = [200, 500, 1000, 1200];
            return data.splice(0, 1)[0];
          },
          clientHeight: 500,
          get scrollHeight() {
            const data = [800, 800, 1600, 1600];
            return data.splice(0, 1)[0];
          }
        }
      };
      container.giphyOverviewElementRef = giphyOverviewElementMock;
      container.scheduler = m.scheduler;
      container.DEBOUNCE_TIME = 10;

      container.ngAfterViewInit();

      m.expect(container.scrollPage$).toBeObservable(expectedFilteredGiphs);

      // m.expect(container.filteredGiphs$).toBeObservable(expectedFilteredGiphs);
    }));
  });
});
