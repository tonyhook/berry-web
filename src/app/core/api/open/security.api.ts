import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Login, UserDetails } from '../..';

@Injectable({
  providedIn: 'root',
})
export class OpenSecurityAPI {

  constructor(
    private http: HttpClient
  ) { }

  getUserDetails(): Observable<UserDetails> {
    return this.http.get<UserDetails>(environment.apipath + '/api/open/security/user-details', { withCredentials: true });
  }

  getSmsVerify(phone: string): Observable<string> {
    const params = new HttpParams()
      .set('phone', phone);

    return this.http.get(environment.apipath + '/api/open/security/sms-verify', { params: params, responseType: 'text', withCredentials: true });
  }

  login(post: Login): Observable<unknown> {
    const formData = new FormData();
    formData.append('username', post.username);
    formData.append('password', post.password);
    formData.append('remember-me', post.rememberMe);

    return this.http.post(environment.apipath + '/login', formData, { withCredentials: true });
  }

  logout(): Observable<unknown> {
    return this.http.post(environment.apipath + '/logout', { }, { withCredentials: true });
  }

}
