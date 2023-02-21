import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

import { WechatService } from '..';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(
    private wechatService: WechatService,
  ) { }

  getOpenid(): string | null {
    if (!environment.needlogin) {
      return 'wechat';
    }

    const openid: string | null = this.wechatService.getLocalUserInfo('openid');

    if (!openid) {
      this.wechatService.getWechatUserInfo('openid');

      return null;
    } else {
      return openid;
    }
  }

}
