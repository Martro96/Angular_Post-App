import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { selectAccessToken } from 'src/app/Auth/reducers/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private accessToken!: string;

  constructor(private router: Router, private store: Store<AppState>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree> {
      return this.store.pipe(
        select(selectAccessToken), 
        map((accessToken) => {
          if(accessToken) {
            return true;
          } else {
            return this.router.createUrlTree(['/login'])
          }
        })
      );
    }
  }

