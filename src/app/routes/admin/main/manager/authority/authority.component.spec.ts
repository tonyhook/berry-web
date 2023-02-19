import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagerComponent } from './authority.component';

describe('AuthorityManagerComponent', () => {
  let component: AuthorityManagerComponent;
  let fixture: ComponentFixture<AuthorityManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorityManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
