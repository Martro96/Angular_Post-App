import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthDTO } from '../Auth/models/auth.dto';
import { Observable } from 'rxjs';

interface AuthToken {
  user_id: string;
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'auth';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  // login(auth: AuthDTO): Promise<AuthToken> {
  //   return this.http.post<AuthToken>(this.urlBlogUocApi, auth).toPromise();
  // }

  //Así lo tenía para el ejercicio 1:
  // login(auth: AuthDTO): Observable<AuthToken> {
  //   return this.http.post<AuthToken>(this.urlBlogUocApi, auth)
  // }
  //Lo cambio a esto para no tener problemas con el AuthDTO en el efecto Login
  login(credentials: {email: string; password: string}): Observable<AuthToken> {
    return this.http.post<AuthToken>(this.urlBlogUocApi, credentials)
  }
}
