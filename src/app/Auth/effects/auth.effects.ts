// import { login, loginSuccess, loginFailure, logout } from "../actions/auth.actions";
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as AuthActions from '../actions/auth.actions';
// import { AuthService } from '../services/auth.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

//Efecto Login

login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((authData) => {
            const fullAuth = { ...credentials, ...authData };
            this.router.navigateByUrl('home'); 
            return AuthActions.loginSuccess({ auth: fullAuth });
          }),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    )
  );
}  