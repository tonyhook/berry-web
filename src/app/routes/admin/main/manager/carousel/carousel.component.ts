import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatTable } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { Carousel, CarouselAPI, ContentChangeEvent } from '../../../../../core';

@Component({
  selector: 'berry-carousel-manager',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({height: '0px', minHeight: '0'})),
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CarouselManagerComponent implements OnInit {
  list = '';
  carousels: Carousel[] = [];

  @ViewChild('table') table?: MatTable<Carousel>;
  displayedColumns: string[] = ['name', 'link'];
  expandedRow: Carousel | null = null;
  showNewForm = false;
  formGroup: FormGroup = this.formBuilder.group({
    'name': ['name', Validators.required],
    'link': ['link', null],
    'disabled': [false, null],
  });
  formGroupNew: FormGroup = this.formBuilder.group({
    'name': ['', Validators.required],
    'link': ['', null],
    'disabled': [true, null],
  });

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private carouselAPI: CarouselAPI,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['list'] != null) {
        if (this.list != params['list']) {
          this.list = params['list'];
          this.getCarouselList();
        }
      }
    });
  }

  getCarouselList() {
    this.carouselAPI.getCarouselList(this.list).subscribe(data => {
      this.carousels = data;
      this.carousels.forEach((carousel, index) => {
        if (carousel.sequence != index) {
          carousel.sequence = index;
          if (carousel.id) {
            this.carouselAPI.updateCarousel(carousel.id, carousel).subscribe();
          }
        }
      });
    });
  }

  selectCarousel(row: Carousel) {
    this.expandedRow = this.expandedRow == row ? null : row;

    if (this.expandedRow) {
      this.formGroup = this.formBuilder.group({
        'name': [this.expandedRow.name, null],
        'link': [this.expandedRow.link, null],
        'disabled': [this.expandedRow.disabled, null],
      });
    }
  }

  newCarousel() {
    if (!this.formGroupNew.valid) {
      this.formGroupNew.markAllAsTouched();
      return;
    }

    const carousel: Carousel = {
      id: null,
      list: this.list,
      sequence: 0,
      name: this.formGroupNew.value.name,
      link: this.formGroupNew.value.link,
      disabled: this.formGroupNew.value.disabled,
    };
    this.carouselAPI.addCarousel(carousel).subscribe(() => {
      this.getCarouselList();
    });

    this.formGroupNew = this.formBuilder.group({
      'name': ['', Validators.required],
      'link': ['', null],
      'disabled': [true, null],
    });
    this.showNewForm = false;
  }

  updateCarousel() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    if (this.expandedRow && this.expandedRow.id) {
      this.expandedRow.name = this.formGroup.value.name;
      this.expandedRow.link = this.formGroup.value.link;
      this.expandedRow.disabled = this.formGroup.value.disabled;

      this.carouselAPI.updateCarousel(this.expandedRow.id, this.expandedRow).subscribe();
    }
  }

  deleteCarousel() {
    if (this.expandedRow && this.expandedRow.id) {
      this.carousels.splice(this.carousels.indexOf(this.expandedRow), 1);
      this.table?.renderRows();
      this.carouselAPI.removeCarousel(this.expandedRow.id).subscribe();
    }
  }

  changeCarousel(event: ContentChangeEvent) {
    if (this.expandedRow && this.expandedRow.id) {
      this.expandedRow.image = event.hash;
      this.carouselAPI.updateCarousel(this.expandedRow.id, this.expandedRow).subscribe();
    }
  }

  dropCarousel(event: CdkDragDrop<Carousel[]>) {
    moveItemInArray(this.carousels, event.previousIndex, event.currentIndex);
    this.carousels.forEach((carousel, index) => {
      if (carousel.sequence != index) {
        carousel.sequence = index;
        if (carousel.id) {
          this.carouselAPI.updateCarousel(carousel.id, carousel).subscribe();
        }
      }
    });
    this.table?.renderRows();
  }

}
