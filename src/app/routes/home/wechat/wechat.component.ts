import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from '../../../../environments/environment';

import { OpenWechatAPI, WechatService } from '../../../core';

@Component({
  selector: 'berry-wechat',
  templateUrl: './wechat.component.html',
  styleUrls: ['./wechat.component.scss'],
})
export class WechatComponent implements OnInit {
  code = '';
  state = '';
  openid = 'wechat';
  avatar = 'avatar';
  gender = 0;
  nickname = 'nickname';
  unionid = 'unionid';
  clean = '';
  error = '';

  constructor(
    private route: ActivatedRoute,
    private wechatAPI: OpenWechatAPI,
    private wechatService: WechatService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.clean = params['clean'];
      if (this.clean) {
        localStorage.removeItem('openid');
        localStorage.removeItem('avatar');
        localStorage.removeItem('gender');
        localStorage.removeItem('nickname');
        localStorage.removeItem('unionid');

        return;
      }

      if (environment.wechat == 'official') {
        this.code = params['code'];
        this.state = params['state'];

        this.wechatAPI.authWechatUserOAuth(this.code).subscribe(
          data => {
            this.openid = data.openid;
            this.wechatService.setOpenid(data.openid);

            if (data.avatar) {
              this.avatar = data.avatar;
              this.wechatService.setAvatar(data.avatar);
            }

            if (data.gender) {
              this.gender = data.gender;
              this.wechatService.setGender(data.gender);
            }

            if (data.nickname) {
              this.nickname = data.nickname;
              this.wechatService.setNickname(data.nickname);
            }

            if (data.unionid) {
              this.unionid = data.unionid;
              this.wechatService.setUnionid(data.unionid);
            }

            location.replace(this.state);
          },
          error => {
            this.error = error.message;
          },
        );
      }
    });
  }

}
