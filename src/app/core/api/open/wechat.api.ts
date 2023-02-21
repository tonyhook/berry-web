import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { WechatUser } from '../..';

@Injectable({
  providedIn: 'root',
})
export class OpenWechatAPI {

  constructor(
    private http: HttpClient
  ) { }

  getWechatAppid(): Observable<string> {
    return this.http.get(environment.apipath + '/api/open/wechat/appid', { responseType: 'text', withCredentials: true });
  }

  getWechatConfig(url: string): Observable<string> {
    const params = new HttpParams()
      .set('url', url);

    return this.http.get(environment.apipath + '/api/open/wechat/config', { params: params, responseType: 'text', withCredentials: true });
  }

  authWechatUserOAuth(code: string): Observable<WechatUser> {
    const params = new HttpParams()
      .set('code', code);

    return this.http.get<WechatUser>(environment.apipath + '/api/open/wechat/oauth', { params: params, withCredentials: true });
  }

  setWechatUser(wechatUser: WechatUser): Observable<unknown> {
    return this.http.post(environment.apipath + '/api/open/wechat/wechatuser', wechatUser, { withCredentials: true });
  }

  getAvatar(openid: string): Observable<string> {
    const params = new HttpParams()
      .set('openid', openid);

    return this.http.get(environment.apipath + '/api/open/wechat/avatar', { params: params, responseType: 'text', withCredentials: true });
  }

  getGender(openid: string): Observable<string> {
    const params = new HttpParams()
      .set('openid', openid);

    return this.http.get(environment.apipath + '/api/open/wechat/gender', { params: params, responseType: 'text', withCredentials: true });
  }

  getNickname(openid: string): Observable<string> {
    const params = new HttpParams()
      .set('openid', openid);

    return this.http.get(environment.apipath + '/api/open/wechat/nickname', { params: params, responseType: 'text', withCredentials: true });
  }

  getUnionid(openid: string): Observable<string> {
    const params = new HttpParams()
      .set('openid', openid);

    return this.http.get(environment.apipath + '/api/open/wechat/unionid', { params: params, responseType: 'text', withCredentials: true });
  }

}
