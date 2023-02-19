import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Authority, Page, PageRequest } from '../..';

@Injectable({
  providedIn: 'root',
})
export class AuthorityAPI {

  constructor(
    private http: HttpClient
  ) { }

  getAuthorityList(request: PageRequest<Authority>): Observable<Page<Authority>> {
    let params = new HttpParams()
      .set('page', request.page.toString())
      .set('size', request.size.toString());
    if (request.sort) {
      params = params
        .set('sort', request.sort.property)
        .set('order', request.sort.order);
    }

    return this.http.get<Page<Authority>>(environment.apipath + '/api/managed/authority', { params: params, withCredentials: true });
  }

  getAuthority(id: number): Observable<Authority> {
    return this.http.get<Authority>(environment.apipath + '/api/managed/authority/' + id, { withCredentials: true });
  }

  addAuthority(newAuthority: Authority): Observable<Authority> {
    return this.http.post<Authority>(environment.apipath + '/api/managed/authority', newAuthority, { withCredentials: true });
  }

  updateAuthority(id: number, newAuthority: Authority): Observable<unknown> {
    return this.http.put(environment.apipath + '/api/managed/authority/' + id, newAuthority, { withCredentials: true });
  }

  removeAuthority(id: number): Observable<unknown> {
    return this.http.delete(environment.apipath + '/api/managed/authority/' + id, { withCredentials: true });
  }

}
