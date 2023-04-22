import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Page, PageRequest, WechatAccount } from '../..';

@Injectable({
  providedIn: 'root',
})
export class WechatAccountAPI {

  constructor(
    private http: HttpClient
  ) { }

  getWechatAccountList(request: PageRequest<WechatAccount>): Observable<Page<WechatAccount>> {
    let params = new HttpParams()
      .set('page', request.page.toString())
      .set('size', request.size.toString());
    if (request.sort) {
      params = params
        .set('sort', request.sort.property)
        .set('order', request.sort.order);
    }

    return this.http.get<Page<WechatAccount>>(environment.apipath + '/api/managed/wechataccount', { params: params, withCredentials: true });
  }

  getWechatAccount(id: number): Observable<WechatAccount> {
    return this.http.get<WechatAccount>(environment.apipath + '/api/managed/wechataccount/' + id, { withCredentials: true });
  }

  addWechatAccount(newWechatAccount: WechatAccount): Observable<WechatAccount> {
    return this.http.post<WechatAccount>(environment.apipath + '/api/managed/wechataccount', newWechatAccount, { withCredentials: true });
  }

  updateWechatAccount(id: number, newWechatAccount: WechatAccount): Observable<unknown> {
    return this.http.put(environment.apipath + '/api/managed/wechataccount/' + id, newWechatAccount, { withCredentials: true });
  }

  removeWechatAccount(id: number): Observable<unknown> {
    return this.http.delete(environment.apipath + '/api/managed/wechataccount/' + id, { withCredentials: true });
  }

}
