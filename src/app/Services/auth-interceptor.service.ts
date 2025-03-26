import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { selectAccessToken } from '../Auth/reducers/auth.selectors';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  // access_token: string | null;
  constructor(private store: Store<AppState>) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store.pipe(
      select(selectAccessToken),
      take(1),
      switchMap((accessToken) => {
        if (accessToken) {
          const cloned = req.clone({
            setHeaders: {
              'Content-Type': 'application/json; charset=utf-8',
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });
          return next.handle(cloned);
        } else {
          return next.handle(req);
        }
      })
    );
  }
}
