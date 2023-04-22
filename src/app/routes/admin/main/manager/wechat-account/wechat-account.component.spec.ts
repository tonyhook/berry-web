import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WechatAccountManagerComponent } from './wechat-account.component';

describe('WechatAccountManagerComponent', () => {
  let component: WechatAccountManagerComponent;
  let fixture: ComponentFixture<WechatAccountManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WechatAccountManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WechatAccountManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
