import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { Agreement, Visitor } from '../..';

@Injectable({
  providedIn: 'root',
})
export class OpenVisitorAPI {

  constructor(
    private http: HttpClient
  ) { }

  register(user: Visitor, verify: string): Observable<unknown> {
    const params = new HttpParams()
      .set('verify', verify);

    return this.http.post(environment.apipath + '/api/open/visitor', user, { params: params, withCredentials: true });
  }

  login(openid: string): Observable<Visitor> {
    return this.http.get<Visitor>(environment.apipath + '/api/open/visitor/' + openid, { withCredentials: true });
  }

  signAgreement(openid: string, name: string, version: number): Observable<unknown> {
    return this.http.post(environment.apipath + '/api/open/visitor/' + openid + '/agreement/' + name + '/version/' + version, { withCredentials: true });
  }

  getAgreement(name: string): Observable<Agreement> {
    return this.http.get<Agreement>(environment.apipath + '/api/open/visitor/agreement/' + name, { withCredentials: true });
  }

}
