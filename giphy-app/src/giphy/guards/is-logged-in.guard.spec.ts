import {IsLoggedInGuard} from './is-logged-in.guard';
import {Observable} from 'rxjs/Observable';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

describe('guard: IsLoggedInGuard', () => {
  let guard: IsLoggedInGuard;
  let authenticationServiceMock;

  beforeEach(() => {
    authenticationServiceMock = {
      authenticate: jest.fn()
    };

    guard = new IsLoggedInGuard(authenticationServiceMock);
  });

  describe('on canActivate', () => {
    it('should call the authentication service to get the account and return it', () => {
      const mockReturnObs$ = Observable.of({firstName: 'firstName'});
      authenticationServiceMock.authenticate.mockReturnValue(mockReturnObs$);

      const result$ = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

      expect(result$).toBe(mockReturnObs$);
    });
  });
});
