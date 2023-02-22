import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

import { OpenVisitorAPI, HistoryService, WechatService } from '..';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(
    private router: Router,
    private wechatService: WechatService,
    private historyService: HistoryService,
    private visitorAPI: OpenVisitorAPI,
  ) { }

  getOpenid(): string | null {
    if (!environment.needlogin) {
      return 'wechat';
    }

    if (window.navigator.userAgent.toLowerCase().indexOf('micromessenger') < 0) {
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

  login(page: string): string | null {
    const openid = this.wechatService.getLocalUserInfo('openid');
    const unionid = this.wechatService.getLocalUserInfo('unionid');

    if (!openid) {
      this.wechatService.getWechatUserInfo('openid');

      return null;
    } else {
      if (!unionid) {
        this.wechatService.getWechatUserInfo('unionid');
      }

      // project container
      if (page == null) {
        return openid;
      }

      // project pages
      this.visitorAPI.login(openid).subscribe({
        // registered
        next: (() => {
          return openid;
        }),
        // not registered
        error: (() => {
          if (page != 'register') {
            let source: string | null = this.router.url;
            if (page == 'home') {
              source = null;
            }
            const target = '/register';

            this.historyService.replace(source, target);
          }
        }),
      });
    }

    return openid;
  }

}
