import { Component, OnInit } from '@angular/core';

import { Agreement, LoginService, OpenVisitorAPI, Visitor, WechatService } from 'src/app/core';

@Component({
  selector: 'berry-entrance',
  templateUrl: './entrance.component.html',
  styleUrls: ['./entrance.component.scss']
})
export class EntranceComponent implements OnInit {
  openid: string | null = null;
  user: Visitor | null = null;
  forbidden = false;
  unregistered = false;
  agreement: Agreement | null = null;
  version: number | null = null;
  message = '';

  constructor(
    private loginService: LoginService,
    private wechatService: WechatService,
    private visitorAPI: OpenVisitorAPI,
  ) { }

  ngOnInit() {
    this.openid = this.loginService.getOpenid();

    if (this.openid != null) {
      this.getUser();
    } else {
      this.wechatService.update$.subscribe(value => {
        if (value[0] == 'openid') {
          this.openid = value[1];
          this.getUser();
        }
      });
    }
  }

  getUser() {
    if (this.openid) {
      this.visitorAPI.login(this.openid).subscribe({
        next: (result => {
          const version = result.agreements.filter(agreement => agreement.name == 'default').map(agreement => agreement.version);

          this.user = result;
          this.unregistered = false;
          this.forbidden = false;
          this.version = version.length > 0 ? Number(version[0]) : 0;
        }),
        error: ((error) => {
          if (error.status == 403) {
            this.forbidden = true;
            this.message = '您被禁止登录系统，请在公众号中留言寻求帮助';
          } else if (error.status == 404) {
            this.unregistered = true;
          } else {
            this.message = '与服务器通信出现错误';
          }
        }),
      });
    }
  }

  signAgreement(agreement: Agreement) {
    if (agreement) {
      if (this.openid) {
        this.visitorAPI.signAgreement(this.openid, agreement.name, agreement.version).subscribe(() => {
          this.version = agreement.version;
        });
      }
    } else {
      this.wechatService.closeWechatWindow();
    }
  }

  registered() {
    this.getUser();
  }

}
