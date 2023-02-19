import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Page, PageRequest, Role } from '../..';

@Injectable({
  providedIn: 'root',
})
export class RoleAPI {

  constructor(
    private http: HttpClient
  ) { }

  getRoleList(request: PageRequest<Role>): Observable<Page<Role>> {
    let params = new HttpParams()
      .set('page', request.page.toString())
      .set('size', request.size.toString());
    if (request.sort) {
      params = params
        .set('sort', request.sort.property)
        .set('order', request.sort.order);
    }

    return this.http.get<Page<Role>>(environment.apipath + '/api/managed/role', { params: params, withCredentials: true });
  }

  getRole(id: number): Observable<Role> {
    return this.http.get<Role>(environment.apipath + '/api/managed/role/' + id, { withCredentials: true });
  }

  addRole(newRole: Role): Observable<Role> {
    return this.http.post<Role>(environment.apipath + '/api/managed/role', newRole, { withCredentials: true });
  }

  updateRole(id: number, newRole: Role): Observable<unknown> {
    return this.http.put(environment.apipath + '/api/managed/role/' + id, newRole, { withCredentials: true });
  }

  removeRole(id: number): Observable<unknown> {
    return this.http.delete(environment.apipath + '/api/managed/role/' + id, { withCredentials: true });
  }

}
