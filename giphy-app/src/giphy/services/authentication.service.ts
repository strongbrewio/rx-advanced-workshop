import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Injectable()
export class AuthenticationService{
  authenticate(): Observable<Account> {
    return Observable
      .of({firstName: 'John', lastName: 'Doe'})
      .delay(200);
  }
}
