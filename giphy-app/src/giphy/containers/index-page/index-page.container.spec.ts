import {IndexPageContainer} from './index-page.container';
import {AuthenticationService} from '../../services/authentication.service';
import {GiphyService} from '../../services/giphy.service';
import {ActivatedRoute} from '@angular/router';
import {marbles} from 'rxjs-marbles';
import createSpyObj = jasmine.createSpyObj;
describe('container: IndexPageContainer', () => {
  let container: IndexPageContainer;
  let authenticationServiceMock: AuthenticationService;
  let giphyServiceMock: GiphyService;
  let activatedRouteMock: ActivatedRoute;

  beforeEach(() => {
    authenticationServiceMock = createSpyObj('authenticationService', ['authenticate']);
    giphyServiceMock = createSpyObj('giphyService', ['fetchGifs']);
    activatedRouteMock = createSpyObj('activatedRoute', ['']);

    container = new IndexPageContainer(
      authenticationServiceMock,
      giphyServiceMock,
      activatedRouteMock);
  });

  describe('on ngAfterViewInit', () => {
    it('should set up the streams for fetching the data with an infinite scroll', marbles((m) => {
      // @formatter:off
      const values = {

      };
      const scroll$ =       m.cold('-------x------x');
      // @formatter:on


      const giphyOverviewElementMock = {
        nativeElement: {
          addEventListener: (eventType, listener) => {

          },
          removeEventListener: () => void 0,
          dispatchEvent: () => void 0,
          get scrollTop() {
            const data = [250, 500];
            return data.splice(0, 1);
          }
        }
      };

      scroll$.subscribe(val => {
          console.log('val');
      });
    }));
  });
});
