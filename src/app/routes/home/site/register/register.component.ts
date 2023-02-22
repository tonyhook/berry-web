import { Component, ViewChild, ElementRef, Renderer2, EventEmitter, Output, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SafeHtml } from '@angular/platform-browser';

import { ContentService, LoginService, OpenRegionAPI, OpenSecurityAPI, OpenVisitorAPI, Agreement, RegionChina, Visitor } from 'src/app/core';
import Swiper, { SwiperOptions } from 'swiper';

@Component({
  selector: 'berry-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  @Output() registered: EventEmitter<unknown> = new EventEmitter();

  formGroup = this.formBuilder.group({
    'name': [null, Validators.required],
    'phone': [null, Validators.required],
    'verify': [null, Validators.required],
  });
  openid: string | null = null;
  lock = false;

  province: string | null = null;
  provinceCode = '000000';
  city: string | null = null;
  cityCode = '000000';
  county: string | null = null;
  countyCode = '000000';

  verifyLabel = '获取验证码';
  verifyTimeout = 0;
  timer: ReturnType<typeof setInterval> = setInterval(() => {
    return;
  }, 1000);

  agreement: Agreement | null = null;
  showAgreement = false;
  agree = false;
  html: SafeHtml = '';

  selectionList: string[] = [];
  currentSelector = '';
  currentSelectorIndex = 0;

  regionChinas: RegionChina[] = [];

  @ViewChild('ib1') ib1: ElementRef | undefined;
  @ViewChild('ib2') ib2: ElementRef | undefined;

  showSelector = false;

  selectConfig: SwiperOptions = {
    direction: 'vertical',
    slidesPerView: 5,
    loop: false,
    centeredSlides: true,
    grabCursor: true,
    initialSlide: 0,
  };
  @ViewChild('swiper', { static: false }) swiper?: Swiper;

  constructor(
    private cd: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private renderer: Renderer2,
    private contentService: ContentService,
    private loginService: LoginService,
    private regionAPI: OpenRegionAPI,
    private visitorAPI: OpenVisitorAPI,
    private securityAPI: OpenSecurityAPI,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.openid = this.loginService.getOpenid();

    this.visitorAPI.getAgreement('default').subscribe(result => {
      this.agreement = result;
      this.html = this.contentService.decodeHtmlFromBlob(this.agreement.text);
    });
  }

  getVerifyCode() {
    if (this.verifyTimeout) {
      return;
    }

    if (this.lock) {
      return;
    }
    this.lock = true;

    this.securityAPI.getSmsVerify(this.formGroup.value.phone).subscribe({
      next: (() => {
        if (this.ib1) {
          this.renderer.addClass(this.ib1.nativeElement, 'verify-button-invalid');
          this.renderer.removeClass(this.ib1.nativeElement, 'verify-button-valid');
        }
        this.verifyTimeout = 60;
        this.verifyLabel = this.verifyTimeout + '秒后重发';

        this.timer = setInterval(() => {
          if (this.verifyTimeout > 0) {
            this.verifyTimeout--;
            this.verifyLabel = this.verifyTimeout + '秒后重发';
          } else {
            if (this.ib1) {
              this.renderer.addClass(this.ib1.nativeElement, 'verify-button-valid');
              this.renderer.removeClass(this.ib1.nativeElement, 'verify-button-invalid');
            }
            this.verifyLabel = '获取验证码';
            if (this.timer) {
              clearInterval(this.timer);
            }
          }
        }, 1000);
        this.lock = false;
      }),
      error: ((error) => {
        this.lock = false;

        if (error.error == 'BADNUMBER') {
          this._snackBar.open('电话号码格式不正确，请重新输入正确的11位手机号码', undefined, {
            duration: 3000
          });
        }
        if (error.error.startsWith('FREQUENTLY')) {
          const interval = error.error.substring(10, error.error.length);
          this._snackBar.open('申请验证码过于频繁，请等待' + interval + '秒后重试', undefined, {
            duration: 3000
          });
        }
        if (error.error == 'FAILED') {
          this._snackBar.open('短信发送失败，请稍后再试', undefined, {
            duration: 3000
          });
        }
      }),
    });
  }

  register() {
    if (this.openid && this.agreement) {
      if (this.formFilled() && !this.lock) {
        this.lock = true;

        const visitor: Visitor = {
          name: this.formGroup.value.name,
          addressCode: this.countyCode,
          phone: this.formGroup.value.phone,
          openid: this.openid,
          enabled: true,
          agreements: [this.agreement],
        };
        this.visitorAPI.register(visitor, this.formGroup.value.verify).subscribe({
          next: (() => {
            this.lock = false;

            this.registered.emit();
          }),
          error: ((error) => {
            this.lock = false;

            if (error.error == 'BADVERIFY') {
              this._snackBar.open('手机验证码不正确，请重新获取验证码', undefined, {
                duration: 3000
              });
            }
            if (error.error == 'NULLOPENID') {
              this._snackBar.open('获取微信凭证失败，请刷新页面重试', undefined, {
                duration: 3000
              });
            }
            if (error.error == 'DUPLICATED') {
              this._snackBar.open('您已注册', undefined, {
                duration: 3000
              });
              this.registered.emit();
            }
          }),
        });
      }
    }
  }

  focusin(index: number) {
    if (index == 5) {
      this.regionAPI.getProvinceList().subscribe(
        data => {
          this.regionChinas = data;
          this.selectionList = [];
          data.forEach(regionChina => this.selectionList.push(regionChina.name));
          this.currentSelector = 'province';
          this.showSelector = true;

          if (this.province == null) {
            this.currentSelectorIndex = 0;
            this.province = data[0].name;
            this.provinceCode = data[0].code;
          } else {
            this.currentSelectorIndex = data.findIndex(regionChina => regionChina.code == this.provinceCode);
          }
        }
      );
    }
    if (index == 6) {
      this.regionAPI.getCityList(this.provinceCode).subscribe(
        data => {
          this.regionChinas = data;
          this.selectionList = [];
          data.forEach(regionChina => this.selectionList.push(regionChina.name));
          this.currentSelector = 'city';
          this.showSelector = true;

          if (this.city == null) {
            this.currentSelectorIndex = 0;
            this.city = data[0].name;
            this.cityCode = data[0].code;
          } else {
            this.currentSelectorIndex = data.findIndex(regionChina => regionChina.code == this.cityCode);
          }
        }
      );
    }
    if (index == 7) {
      this.regionAPI.getCountyList(this.cityCode).subscribe(
        data => {
          this.regionChinas = data;
          this.selectionList = [];
          data.forEach(regionChina => this.selectionList.push(regionChina.name));
          this.showSelector = true;
          this.currentSelector = 'county';

          if (this.county == null) {
            this.currentSelectorIndex = 0;
            this.county = data[0].name;
            this.countyCode = data[0].code;
          } else {
            this.currentSelectorIndex = data.findIndex(regionChina => regionChina.code == this.countyCode);
          }
        }
      );
    }
  }

  focusout() {
    if (this.openid && this.formFilled()) {
      if (this.ib2) {
        this.renderer.addClass(this.ib2.nativeElement, 'valid');
        this.renderer.removeClass(this.ib2.nativeElement, 'invalid');
      }
    } else {
      if (this.ib2) {
        this.renderer.addClass(this.ib2.nativeElement, 'invalid');
        this.renderer.removeClass(this.ib2.nativeElement, 'valid');
      }
    }
  }

  readAgreement() {
    this.showAgreement = true;
  }

  closeAgreement() {
    this.showAgreement = false;
  }

  toggleAgreement() {
    this.agree = !this.agree;
    this.focusout();
  }

  closeSelector() {
    this.showSelector = false;
  }

  onSlideChange() {
    if (!this.swiper) {
      return;
    }

    if (this.swiper.realIndex == this.currentSelectorIndex) {
      return;
    }

    this.currentSelectorIndex = this.swiper.realIndex;

    if (this.currentSelector == 'province') {
      this.province = this.selectionList[this.currentSelectorIndex];
      const regionChina = this.regionChinas.find(regionChina => regionChina.name == this.province);
      if (regionChina) {
        this.provinceCode = regionChina.code;
      } else {
        this.provinceCode = '000000';
      }
      this.city = null;
      this.county = null;
    }
    if (this.currentSelector == 'city') {
      this.city = this.selectionList[this.currentSelectorIndex];
      const regionChina = this.regionChinas.find(regionChina => regionChina.name == this.city);
      if (regionChina) {
        this.cityCode = regionChina.code;
      } else {
        this.cityCode = '000000';
      }
      this.county = null;
    }
    if (this.currentSelector == 'county') {
      this.county = this.selectionList[this.currentSelectorIndex];
      const regionChina = this.regionChinas.find(regionChina => regionChina.name == this.county);
      if (regionChina) {
        this.countyCode = regionChina.code;
      } else {
        this.countyCode = '000000';
      }
    }

    this.cd.detectChanges();
    this.focusout();
  }

  onSwiper(swiper: Swiper) {
    this.swiper = swiper;
    this.swiper.slideTo(this.currentSelectorIndex);
  }

  formFilled(): boolean {
    let filled = true;
    if (!this.formGroup.valid) {
      filled = false;
    }
    if (!this.province || !this.city || !this.county) {
      filled = false;
    }
    if (!this.agree) {
      filled = false;
    }

    return filled;
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

}
