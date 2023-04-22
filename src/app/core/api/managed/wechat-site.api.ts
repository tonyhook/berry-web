import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Page, PageRequest, WechatSite } from '../..';

@Injectable({
  providedIn: 'root',
})
export class WechatSiteAPI {

  constructor(
    private http: HttpClient
  ) { }

  getWechatSiteList(request: PageRequest<WechatSite>): Observable<Page<WechatSite>> {
    let params = new HttpParams()
      .set('page', request.page.toString())
      .set('size', request.size.toString());
    if (request.sort) {
      params = params
        .set('sort', request.sort.property)
        .set('order', request.sort.order);
    }

    return this.http.get<Page<WechatSite>>(environment.apipath + '/api/managed/wechatsite', { params: params, withCredentials: true });
  }

  getWechatSite(id: number): Observable<WechatSite> {
    return this.http.get<WechatSite>(environment.apipath + '/api/managed/wechatsite/' + id, { withCredentials: true });
  }

  addWechatSite(newWechatSite: WechatSite): Observable<WechatSite> {
    return this.http.post<WechatSite>(environment.apipath + '/api/managed/wechatsite', newWechatSite, { withCredentials: true });
  }

  updateWechatSite(id: number, newWechatSite: WechatSite): Observable<unknown> {
    return this.http.put(environment.apipath + '/api/managed/wechatsite/' + id, newWechatSite, { withCredentials: true });
  }

  removeWechatSite(id: number): Observable<unknown> {
    return this.http.delete(environment.apipath + '/api/managed/wechatsite/' + id, { withCredentials: true });
  }

}
