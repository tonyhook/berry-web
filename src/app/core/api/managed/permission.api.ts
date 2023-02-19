import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Page, PageRequest, Permission } from '../..';

@Injectable({
  providedIn: 'root',
})
export class PermissionAPI {

  constructor(
    private http: HttpClient
  ) { }

  getResourceTypeList(): Observable<string[]> {
    return this.http.get<string[]>(environment.apipath + '/api/managed/permission/resourceType', { withCredentials: true });
  }

  getItemPermissionList(resourceType: string, resourceId: number): Observable<Permission[]> {
    return this.http.get<Permission[]>(environment.apipath + '/api/managed/permission/resourceType/' + resourceType + '/resourceId/' + resourceId, { withCredentials: true });
  }

  getInheritedPermissionList(resourceType: string, resourceId: number): Observable<Permission[]> {
    return this.http.get<Permission[]>(environment.apipath + '/api/managed/permission/resourceType/' + resourceType + '/resourceId/' + resourceId + '/inherited', { withCredentials: true });
  }

  getFullPermissionList(resourceType: string, resourceId: number): Observable<Permission[]> {
    return this.http.get<Permission[]>(environment.apipath + '/api/managed/permission/resourceType/' + resourceType + '/resourceId/' + resourceId + '/full', { withCredentials: true });
  }

  getClassPermissionList(resourceType: string): Observable<Permission[]> {
    return this.http.get<Permission[]>(environment.apipath + '/api/managed/permission/resourceType/' + resourceType, { withCredentials: true });
  }

  getPermissionList(request: PageRequest<Permission>): Observable<Page<Permission>> {
    let params = new HttpParams()
      .set('page', request.page.toString())
      .set('size', request.size.toString());
    if (request.sort) {
      params = params
        .set('sort', request.sort.property)
        .set('order', request.sort.order);
    }

    return this.http.get<Page<Permission>>(environment.apipath + '/api/managed/permission', { params: params, withCredentials: true });
  }

  getPermission(id: number): Observable<Permission> {
    return this.http.get<Permission>(environment.apipath + '/api/managed/permission/' + id, { withCredentials: true });
  }

  addPermission(newPermission: Permission): Observable<Permission> {
    return this.http.post<Permission>(environment.apipath + '/api/managed/permission', newPermission, { withCredentials: true });
  }

  updatePermission(id: number, newPermission: Permission): Observable<unknown> {
    return this.http.put(environment.apipath + '/api/managed/permission/' + id, newPermission, { withCredentials: true });
  }

  removePermission(id: number): Observable<unknown> {
    return this.http.delete(environment.apipath + '/api/managed/permission/' + id, { withCredentials: true });
  }

}
