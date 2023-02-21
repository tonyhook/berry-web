import { Injectable } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';

import { wx } from 'weixin-js-sdk';

import { environment } from '../../../environments/environment';

import { OpenApplicationAPI } from '../api/open/application.api';
import { OpenWechatAPI } from '../api/open/wechat.api';

@Injectable({
  providedIn: 'root',
})
export class WechatService {

  public update$: Subject<[string, string]>;

  constructor(
    private applicationAPI: OpenApplicationAPI,
    private wechatAPI: OpenWechatAPI,
  ) {
    this.update$ = new Subject<[string, string]>();
  }

  setWechatShareConfig(title: string, desc: string, link: string, imgUrl: string) {
    forkJoin([
      this.applicationAPI.getBaseUrl(),
      this.wechatAPI.getWechatConfig(location.href.split('#')[0]),
    ]).subscribe(
      result => {
        const params = result[1].split('&');
        const config = {
          debug: false,
          appId: '',
          timestamp: '',
          nonceStr: '',
          signature: '',
          jsApiList: [
            'updateAppMessageShareData',
            'updateTimelineShareData',
          ]
        };
        for (let i = 0; i < params.length; i++) {
          if (params[i].split('=')[0] == 'appId') {
            config.appId = params[i].split('=')[1];
          }
          if (params[i].split('=')[0] == 'timestamp') {
            config.timestamp = params[i].split('=')[1];
          }
          if (params[i].split('=')[0] == 'nonceStr') {
            config.nonceStr = params[i].split('=')[1];
          }
          if (params[i].split('=')[0] == 'signature') {
            config.signature = params[i].split('=')[1];
          }
        }
        wx.config(config);
        wx.ready(function() {
          setTimeout(() => {
            wx.updateAppMessageShareData({
              title: title,
              desc: desc,
              link: result[0] + link,
              imgUrl: result[0] + imgUrl,
              success: function () {
                return;
              }
            });
            wx.updateTimelineShareData({
              title: title,
              desc: desc,
              link: result[0] + link,
              imgUrl: result[0] + imgUrl,
              success: function () {
                return;
              }
            });
          }, 500);
        });
        // wx.error(function(res: any) {
        //   alert(JSON.stringify(res));
        // });
      }
    );
  }

  hideWechatShareConfig() {
    forkJoin([
      this.applicationAPI.getBaseUrl(),
      this.wechatAPI.getWechatConfig(location.href.split('#')[0]),
    ]).subscribe(
      result => {
        const params = result[1].split('&');
        const config = {
          debug: false,
          appId: '',
          timestamp: '',
          nonceStr: '',
          signature: '',
          jsApiList: [
            'hideMenuItems'
          ]
        };
        for (let i = 0; i < params.length; i++) {
          if (params[i].split('=')[0] == 'appId') {
            config.appId = params[i].split('=')[1];
          }
          if (params[i].split('=')[0] == 'timestamp') {
            config.timestamp = params[i].split('=')[1];
          }
          if (params[i].split('=')[0] == 'nonceStr') {
            config.nonceStr = params[i].split('=')[1];
          }
          if (params[i].split('=')[0] == 'signature') {
            config.signature = params[i].split('=')[1];
          }
        }
        wx.config(config);
        wx.ready(function () {
          wx.hideMenuItems({
            menuList: [
              'menuItem:copyUrl',
              'menuItem:favorite',
              'menuItem:openWithQQBrowser',
              'menuItem:openWithSafari',
              'menuItem:share:appMessage',
              'menuItem:share:brand',
              'menuItem:share:email',
              'menuItem:share:facebook',
              'menuItem:share:qq',
              'menuItem:share:QZone',
              'menuItem:share:timeline',
              'menuItem:share:weiboApp',
            ]
          });
        });
        // wx.error(function(res: any) {
        //   alert(JSON.stringify(res));
        // });
      }
    );
  }

  closeWechatWindow() {
    forkJoin([
      this.applicationAPI.getBaseUrl(),
      this.wechatAPI.getWechatConfig(location.href.split('#')[0]),
    ]).subscribe(
      result => {
        const params = result[1].split('&');
        const config = {
          debug: false,
          appId: '',
          timestamp: '',
          nonceStr: '',
          signature: '',
          jsApiList: [
            'closeWindow',
          ]
        };
        for (let i = 0; i < params.length; i++) {
          if (params[i].split('=')[0] == 'appId') {
            config.appId = params[i].split('=')[1];
          }
          if (params[i].split('=')[0] == 'timestamp') {
            config.timestamp = params[i].split('=')[1];
          }
          if (params[i].split('=')[0] == 'nonceStr') {
            config.nonceStr = params[i].split('=')[1];
          }
          if (params[i].split('=')[0] == 'signature') {
            config.signature = params[i].split('=')[1];
          }
        }
        wx.config(config);
        wx.ready(function() {
          wx.closeWindow();
        });
        // wx.error(function(res: any) {
        //   alert(JSON.stringify(res));
        // });
      }
    );
  }

  getLocalUserInfo(key: string): string | null {
    return localStorage.getItem(key);
  }

  getServerUserInfo(openid: string, key: string) {
    if (openid == null) {
      return;
    }
    if (key == 'avatar') {
      this.wechatAPI.getAvatar(openid).subscribe(
        data => {
          this.setAvatar(data);
        },
        error => {
          if (error.status == 401) {
            this.getWechatUserInfo('avatar');
          }
        }
      );
    }
    if (key == 'gender') {
      this.wechatAPI.getGender(openid).subscribe(
        data => {
          this.setGender(parseInt(data));
        },
        error => {
          if (error.status == 401) {
            this.getWechatUserInfo('gender');
          }
        }
      );
    }
    if (key == 'nickname') {
      this.wechatAPI.getNickname(openid).subscribe(
        data => {
          this.setNickname(data);
        },
        error => {
          if (error.status == 401) {
            this.getWechatUserInfo('nickname');
          }
        }
      );
    }
    if (key == 'unionid') {
      this.wechatAPI.getUnionid(openid).subscribe(
        data => {
          this.setUnionid(data);
        },
        error => {
          if (error.status == 401) {
            this.getWechatUserInfo('unionid');
          }
        }
      );
    }
  }

  getWechatUserInfo(key: string) {
    if (environment.wechat == 'official') {
      if (key == 'openid') {
        forkJoin([
          this.applicationAPI.getBaseUrl(),
          this.wechatAPI.getWechatAppid(),
        ]).subscribe(
          results => {
            location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid='
              + results[1] + '&redirect_uri=' + encodeURIComponent(results[0] + 'wechat')
              + '&response_type=code&scope=snsapi_base&state=' + encodeURIComponent(window.location.href)
              + '&connect_redirect=1#wechat_redirect');
          }
        );
      }
      if (key == 'avatar' || key == 'gender' || key == 'nickname' || key == 'unionid') {
        forkJoin([
          this.applicationAPI.getBaseUrl(),
          this.wechatAPI.getWechatAppid(),
        ]).subscribe(
          results => {
            location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid='
              + results[1] + '&redirect_uri=' + encodeURIComponent(results[0] + 'wechat')
              + '&response_type=code&scope=snsapi_userinfo&state=' + encodeURIComponent(window.location.href)
              + '&connect_redirect=1#wechat_redirect');
          }
        );
      }
    }
  }

  setOpenid(openid: string) {
    localStorage.setItem('openid', openid);
    this.update$.next(['openid', openid]);
  }

  setAvatar(avatar: string) {
    localStorage.setItem('avatar', avatar);
    this.update$.next(['avatar', avatar]);
  }

  setGender(gender: number) {
    localStorage.setItem('gender', gender.toString());
    this.update$.next(['gender', gender.toString()]);
  }

  setNickname(nickname: string) {
    localStorage.setItem('nickname', nickname);
    this.update$.next(['nickname', nickname]);
  }

  setUnionid(unionid: string) {
    localStorage.setItem('unionid', unionid);
    this.update$.next(['unionid', unionid]);
  }

}
