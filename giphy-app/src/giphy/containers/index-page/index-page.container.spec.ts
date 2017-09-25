import {IndexPageContainer} from './index-page.container';
import {AuthenticationService} from '../../services/authentication.service';
import {GiphyService} from '../../services/giphy.service';
import {ActivatedRoute} from '@angular/router';
import createSpyObj = jasmine.createSpyObj;
import {marbles} from 'rxjs-marbles';
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
    it('should set up the streams for fetching the data with an infinite scroll', marbles((m)) => {

    });
  });
});
