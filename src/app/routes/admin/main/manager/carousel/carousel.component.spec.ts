import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselManagerComponent } from './carousel.component';

describe('CarouselManagerComponent', () => {
  let component: CarouselManagerComponent;
  let fixture: ComponentFixture<CarouselManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
