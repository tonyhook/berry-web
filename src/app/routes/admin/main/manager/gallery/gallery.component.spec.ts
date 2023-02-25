import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryManagerComponent } from './gallery.component';

describe('GalleryManagerComponent', () => {
  let component: GalleryManagerComponent;
  let fixture: ComponentFixture<GalleryManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GalleryManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
