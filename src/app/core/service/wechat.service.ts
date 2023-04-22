import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';

import { wx } from 'weixin-js-sdk';

import { environment } from '../../../environments/environment';

import { OpenWechatAPI } from '../api/open/wechat.api';

@Injectable({
  providedIn: 'root',
})
export class WechatService {

  public update$: Subject<[string, string]>;

  constructor(
    private wechatAPI: OpenWechatAPI,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.update$ = new Subject<[string, string]>();
  }

  setWechatShareConfig(title: string, desc: string, link: string, imgUrl: string) {
    const appid = this.getLocalUserInfo('appid');
    const origin = this.document.location.origin;

    if (appid != null) {
      this.wechatAPI.getWechatConfig(appid, location.href.split('#')[0]).subscribe(
        result => {
          const params = result.split('&');
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
                link: origin + link,
                imgUrl: origin + imgUrl,
                success: function () {
                  return;
                }
              });
              wx.updateTimelineShareData({
                title: title,
                desc: desc,
                link: origin + link,
                imgUrl: origin + imgUrl,
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
  }

  hideWechatShareConfig() {
    const appid = this.getLocalUserInfo('appid');
    if (appid != null) {
      this.wechatAPI.getWechatConfig(appid, location.href.split('#')[0]).subscribe(
        result => {
          const params = result.split('&');
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
  }

  closeWechatWindow() {
    const appid = this.getLocalUserInfo('appid');
    if (appid != null) {
      this.wechatAPI.getWechatConfig(appid, location.href.split('#')[0]).subscribe(
        result => {
          const params = result.split('&');
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
  }

  getLocalUserInfo(key: string): string | null {
    return localStorage.getItem(key);
  }

  getServerUserInfo(openid: string, key: string) {
    if (openid == null) {
      return;
    }
    if (key == 'avatar') {
      this.wechatAPI.getAvatar(openid).subscribe({
        next: data => {
          this.setAvatar(data);
        },
        error: error => {
          if (error.status == 401) {
            this.getWechatUserInfo('avatar');
          }
        },
      });
    }
    if (key == 'gender') {
      this.wechatAPI.getGender(openid).subscribe({
        next: data => {
          this.setGender(parseInt(data));
        },
        error: error => {
          if (error.status == 401) {
            this.getWechatUserInfo('gender');
          }
        },
      });
    }
    if (key == 'nickname') {
      this.wechatAPI.getNickname(openid).subscribe({
        next: data => {
          this.setNickname(data);
        },
        error: error => {
          if (error.status == 401) {
            this.getWechatUserInfo('nickname');
          }
        },
      });
    }
    if (key == 'unionid') {
      this.wechatAPI.getUnionid(openid).subscribe({
        next: data => {
          this.setUnionid(data);
        },
        error: error => {
          if (error.status == 401) {
            this.getWechatUserInfo('unionid');
          }
        },
      });
    }
  }

  getWechatUserInfo(key: string) {
    this.wechatAPI.getWechatAppid(this.document.location.hostname).subscribe(
      result => {
        const appid = result;
        this.setAppid(appid);

        if (environment.wechat == 'official') {
          if (key == 'openid') {
            this.wechatAPI.getWechatAccountAuthDomain(appid).subscribe(
              result => {
                location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid='
                  + appid + '&redirect_uri=' + encodeURIComponent('https://' + result + '/wechat')
                  + '&response_type=code&scope=snsapi_base&state=' + encodeURIComponent(window.location.href)
                  + '&connect_redirect=1#wechat_redirect');
              }
            );
          }
          if (key == 'avatar' || key == 'gender' || key == 'nickname' || key == 'unionid') {
            this.wechatAPI.getWechatAccountAuthDomain(appid).subscribe(
              result => {
                location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid='
                  + appid + '&redirect_uri=' + encodeURIComponent('https://' + result + '/wechat')
                  + '&response_type=code&scope=snsapi_userinfo&state=' + encodeURIComponent(window.location.href)
                  + '&connect_redirect=1#wechat_redirect');
              }
            );
          }
        }
      }
    );
  }

  setAppid(appid: string) {
    localStorage.setItem('appid', appid);
    this.update$.next(['appid', appid]);
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
