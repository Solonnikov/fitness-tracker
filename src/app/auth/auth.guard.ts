import {ActivatedRouteSnapshot, CanLoad, CanActivate, Route, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import {take} from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(public router: Router, public store: Store<fromRoot.State>) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }

  canLoad(route: Route) {
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }
}
