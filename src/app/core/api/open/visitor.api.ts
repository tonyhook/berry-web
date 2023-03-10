import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { Agreement, ManagedResource, Page, PageRequest, ProfileLog, Visitor } from '../..';

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

  getProfileLogList(openid: string, resourceType: string, resourceId: number, action: number, value: string, request: PageRequest<ProfileLog>): Observable<Page<ProfileLog>> {
    let params = new HttpParams()
      .set('resourceType', resourceType)
      .set('page', request.page.toString())
      .set('size', request.size.toString());
    if (resourceId) {
      params = params
        .set('resourceId', resourceId);
    }
    if (action) {
      params = params
        .set('action', action);
    }
    if (value) {
      params = params
        .set('value', value);
    }
    if (request.sort) {
      params = params
        .set('sort', request.sort.property)
        .set('order', request.sort.order);
    }

    return this.http.get<Page<ProfileLog>>(environment.apipath + '/api/open/visitor/' + openid + '/profilelog', { params: params, withCredentials: true });
  }

  mergeProfileLog(openid: string, resourceType: string, resourceId: number, aggregateLevel: number, valueType: number, action: number, value: string): Observable<unknown> {
    const log: ProfileLog = {
      openid: openid,
      resourceType: resourceType,
      resourceId: resourceId,
      aggregateLevel: aggregateLevel,
      valueType: valueType,
      action: action,
      value: value,
    };

    return this.http.post(environment.apipath + '/api/open/visitor/' + openid + '/profilelog', log, { withCredentials: true });
  }

  search(openid: string, resourceType: string, keywords: string, request: PageRequest<ManagedResource>): Observable<Page<unknown>> {
    const params = new HttpParams()
      .set('resourceType', resourceType)
      .set('keywords', keywords)
      .set('page', request.page.toString())
      .set('size', request.size.toString());

    return this.http.get<Page<unknown>>(environment.apipath + '/api/open/visitor/' + openid + '/search', { params: params, withCredentials: true });
  }

  getSearchKeywordsList(openid: string, resourceType: string, request: PageRequest<ManagedResource>): Observable<Page<string>> {
    const params = new HttpParams()
      .set('resourceType', resourceType)
      .set('page', request.page.toString())
      .set('size', request.size.toString());

    return this.http.get<Page<string>>(environment.apipath + '/api/open/visitor/' + openid + '/searchlog', { params: params, withCredentials: true });
  }

  clearSearchLog(openid: string, resourceType: string): Observable<unknown> {
    const params = new HttpParams()
      .set('resourceType', resourceType);

    return this.http.delete(environment.apipath + '/api/open/visitor/' + openid + '/searchlog', { params: params, withCredentials: true });
  }

}
