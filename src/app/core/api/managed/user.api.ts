import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Page, PageRequest, User } from '../..';

@Injectable({
  providedIn: 'root',
})
export class UserAPI {

  constructor(
    private http: HttpClient
  ) { }

  getUserList(request: PageRequest<User>): Observable<Page<User>> {
    let params = new HttpParams()
      .set('page', request.page.toString())
      .set('size', request.size.toString());
    if (request.sort) {
      params = params
        .set('sort', request.sort.property)
        .set('order', request.sort.order);
    }

    return this.http.get<Page<User>>(environment.apipath + '/api/managed/user', { params: params, withCredentials: true });
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(environment.apipath + '/api/managed/user/' + id, { withCredentials: true });
  }

  addUser(newUser: User): Observable<User> {
    return this.http.post<User>(environment.apipath + '/api/managed/user', newUser, { withCredentials: true });
  }

  updateUser(id: number, newUser: User): Observable<unknown> {
    return this.http.put(environment.apipath + '/api/managed/user/' + id, newUser, { withCredentials: true });
  }

  removeUser(id: number): Observable<unknown> {
    return this.http.delete(environment.apipath + '/api/managed/user/' + id, { withCredentials: true });
  }

}
