import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { PaginatedDataSource, Sort, WechatAccount, WechatAccountAPI, WechatSite } from '../../../../../core';

@Component({
  selector: 'berry-wechat-account-manager',
  templateUrl: './wechat-account.component.html',
  styleUrls: ['./wechat-account.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class WechatAccountManagerComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'appid', 'originalid'];
  initialSort: Sort<WechatAccount> = {property: 'id', order: 'asc'};
  expandedRow: WechatAccount | null = null;
  showNewForm = false;
  formGroup: UntypedFormGroup = this.formBuilder.group({
    'type': ['officialaccount', Validators.required],
    'name': ['', Validators.required],
    'originalid': ['', Validators.required],
    'email': ['', Validators.required],
    'password': ['', Validators.required],
    'appid': ['', Validators.required],
    'secret': ['', Validators.required],
    'wechatid': ['', null],
    'messageToken': ['', null],
    'verifyFilename': ['', null],
    'verifyContent': ['', null],
    'authDomain': ['', null],
    'wechatSites': ['', null],
  });
  formGroupNew: UntypedFormGroup = this.formBuilder.group({
    'type': ['officialaccount', Validators.required],
    'name': ['', Validators.required],
    'originalid': ['', Validators.required],
    'email': ['', Validators.required],
    'password': ['', Validators.required],
    'appid': ['', Validators.required],
    'secret': ['', Validators.required],
    'wechatid': ['', null],
    'messageToken': ['', null],
    'verifyFilename': ['', null],
    'verifyContent': ['', null],
    'authDomain': ['', null],
  });
  @ViewChild(MatSort, {static: true}) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  data = new PaginatedDataSource<WechatAccount, null>(
    (request) => this.wechatAccountAPI.getWechatAccountList(request),
    this.initialSort,
    null,
    10
  );

  constructor(
    private formBuilder: UntypedFormBuilder,
    private wechatAccountAPI: WechatAccountAPI,
  ) { }

  ngAfterViewInit() {
    if (this.sort) {
      this.sort.sortChange.subscribe(sort => {
        if (sort.direction == '') {
          sort.active = this.initialSort.property;
          sort.direction = this.initialSort.order;
        }
        this.data.sortBy({property: sort.active as keyof WechatAccount, order: sort.direction});
      });
    }
  }

  selectWechatAccount(row: WechatAccount) {
    this.expandedRow = this.expandedRow == row ? null : row;

    if (!this.expandedRow) {
      return;
    }

    const domains = this.expandedRow.wechatSites?.map(ws => ws.domain).join(', ');

    this.formGroup = this.formBuilder.group({
      'type': [this.expandedRow.type, Validators.required],
      'name': [this.expandedRow.name, Validators.required],
      'originalid': [this.expandedRow.originalid, Validators.required],
      'email': [this.expandedRow.email, Validators.required],
      'password': [this.expandedRow.password, Validators.required],
      'appid': [this.expandedRow.appid, Validators.required],
      'secret': [this.expandedRow.secret, Validators.required],
      'wechatid': [this.expandedRow.wechatid, null],
      'messageToken': [this.expandedRow.messageToken, null],
      'verifyFilename': [this.expandedRow.verifyFilename, null],
      'verifyContent': [this.expandedRow.verifyContent, null],
      'authDomain': [this.expandedRow.authDomain, null],
      'wechatSites': [domains, null],
    });
  }

  newWechatAccount() {
    if (!this.formGroupNew.valid) {
      this.formGroupNew.markAllAsTouched();
      return;
    }

    const wechatAccount: WechatAccount = {
      type: this.formGroupNew.value.type,
      name: this.formGroupNew.value.name,
      wechatid: this.formGroupNew.value.wechatid,
      originalid: this.formGroupNew.value.originalid,
      email: this.formGroupNew.value.email,
      password: this.formGroupNew.value.password,
      appid: this.formGroupNew.value.appid,
      secret: this.formGroupNew.value.secret,
      messageToken: this.formGroupNew.value.messageToken,
      verifyFilename: this.formGroupNew.value.verifyFilename,
      verifyContent: this.formGroupNew.value.verifyContent,
      authDomain: this.formGroupNew.value.authDomain,
      wechatSites: [],
    };
    this.wechatAccountAPI.addWechatAccount(wechatAccount).subscribe(() => {
      if (this.paginator) {
        this.data.fetch(this.paginator.pageIndex);
      }
    });
    this.formGroupNew = this.formBuilder.group({
      'type': ['officialaccount', Validators.required],
      'name': ['', Validators.required],
      'originalid': ['', Validators.required],
      'email': ['', Validators.required],
      'password': ['', Validators.required],
      'appid': ['', Validators.required],
      'secret': ['', Validators.required],
      'wechatid': ['', null],
      'messageToken': ['', null],
      'verifyFilename': ['', null],
      'verifyContent': ['', null],
      'authDomain': ['', null],
    });
    this.showNewForm = false;
  }

  updateWechatAccount() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    if (this.expandedRow && this.expandedRow.id) {
      const wechatAccount: WechatAccount = this.expandedRow;

      const domains: string[] = this.formGroup.value.wechatSites.split(',');
      const wechatSites: WechatSite[] = [];
      for (const domain of domains) {
        const wechatSite: WechatSite = {
          domain: domain.trim(),
          wechatAccount: {id: wechatAccount.id},
        }
        wechatSites.push(wechatSite);
      }

      wechatAccount.type = this.formGroup.value.type;
      wechatAccount.name = this.formGroup.value.name;
      wechatAccount.originalid = this.formGroup.value.originalid;
      wechatAccount.email = this.formGroup.value.email;
      wechatAccount.password = this.formGroup.value.password;
      wechatAccount.appid = this.formGroup.value.appid;
      wechatAccount.secret = this.formGroup.value.secret;
      wechatAccount.wechatid = this.formGroup.value.wechatid;
      wechatAccount.messageToken = this.formGroup.value.messageToken;
      wechatAccount.verifyFilename = this.formGroup.value.verifyFilename;
      wechatAccount.verifyContent = this.formGroup.value.verifyContent;
      wechatAccount.authDomain = this.formGroup.value.authDomain;
      wechatAccount.wechatSites = wechatSites;
      if (wechatAccount.id) {
        this.wechatAccountAPI.updateWechatAccount(wechatAccount.id, wechatAccount).subscribe(() => {
          if (this.paginator) {
            this.data.fetch(this.paginator.pageIndex);
          }
        });
      }
    }
  }

  deleteWechatAccount() {
    if (this.expandedRow) {
      const wechatAccount: WechatAccount = this.expandedRow;
      if (wechatAccount.id) {
        this.wechatAccountAPI.removeWechatAccount(wechatAccount.id).subscribe(() => {
          if (this.paginator) {
            this.data.fetch(this.paginator.pageIndex);
          }
        });
      }
    }
  }

}
