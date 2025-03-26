import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthDTO } from '../models/auth.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/user/login';

  constructor(private http: HttpClient) { }

  login(credentials: {email: string; password: string}): Observable<{ user_id: string, access_token: string}> {
    return this.http.post<{user_id: string, access_token: string}>(this.apiUrl, credentials);
  }
}
