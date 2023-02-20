import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfUploaderComponent } from './pdfuploader.component';

describe('PdfUploaderComponent', () => {
  let component: PdfUploaderComponent;
  let fixture: ComponentFixture<PdfUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfUploaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
