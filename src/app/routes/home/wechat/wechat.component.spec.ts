import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WechatComponent } from './wechat.component';

describe('WechatComponent', () => {
  let component: WechatComponent;
  let fixture: ComponentFixture<WechatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WechatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WechatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
