import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuManagerComponent } from './menu.component';

describe('MenuManagerComponent', () => {
  let component: MenuManagerComponent;
  let fixture: ComponentFixture<MenuManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
