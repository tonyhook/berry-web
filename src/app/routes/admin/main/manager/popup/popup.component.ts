import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatTable } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common'

import { Popup, PopupAPI, ContentChangeEvent } from '../../../../../core';

@Component({
  selector: 'berry-popup-manager',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({height: '0px', minHeight: '0'})),
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [DatePipe]
})
export class PopupManagerComponent implements OnInit {
  list = '';
  popups: Popup[] = [];

  @ViewChild('table') table?: MatTable<Popup>;
  displayedColumns: string[] = ['name', 'link'];
  expandedRow: Popup | null = null;
  showNewForm = false;
  formGroup: FormGroup = this.formBuilder.group({
    'name': ['name', Validators.required],
    'link': ['link', null],
    'code': ['code', null],
    'freq': ['day', Validators.required],
    'terminate': ['view', Validators.required],
    'startTime': ['', Validators.required],
    'endTime': ['', Validators.required],
    'disabled': [false, null],
  });
  formGroupNew: FormGroup = this.formBuilder.group({
    'name': ['', Validators.required],
    'link': ['', null],
    'code': ['', null],
    'freq': ['day', Validators.required],
    'terminate': ['view', Validators.required],
    'startTime': ['', Validators.required],
    'endTime': ['', Validators.required],
    'disabled': [true, null],
  });

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private popupAPI: PopupAPI,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['list'] != null) {
        if (this.list != params['list']) {
          this.list = params['list'];
          this.getPopupList();
        }
      }
    });
  }

  getPopupList() {
    this.popupAPI.getPopupList(this.list).subscribe(data => {
      this.popups = data;
      this.popups.forEach((popup, index) => {
        if (popup.sequence != index) {
          popup.sequence = index;
          if (popup.id) {
            this.popupAPI.updatePopup(popup.id, popup).subscribe();
          }
        }
      });
    });
  }

  selectPopup(row: Popup) {
    this.expandedRow = this.expandedRow == row ? null : row;

    if (this.expandedRow && this.expandedRow.startTime) {
      this.formGroup = this.formBuilder.group({
        'name': [this.expandedRow.name, Validators.required],
        'link': [this.expandedRow.link, null],
        'code': [this.expandedRow.code, null],
        'freq': [this.expandedRow.freq, Validators.required],
        'terminate': [this.expandedRow.terminate, Validators.required],
        'startTime': [this.datePipe.transform(this.expandedRow.startTime, 'yyyy-MM-ddTHH:mm'), Validators.required],
        'endTime': [this.datePipe.transform(this.expandedRow.endTime, 'yyyy-MM-ddTHH:mm'), Validators.required],
        'disabled': [this.expandedRow.disabled, null],
      });
    }
  }

  newPopup() {
    if (!this.formGroupNew.valid) {
      this.formGroupNew.markAllAsTouched();
      return;
    }

    const popup: Popup = {
      id: null,
      list: this.list,
      sequence: 0,
      name: this.formGroupNew.value.name,
      link: this.formGroupNew.value.link,
      code: this.formGroupNew.value.code,
      freq: this.formGroupNew.value.freq,
      terminate: this.formGroupNew.value.terminate,
      startTime: new Date(this.formGroupNew.value.startTime).toISOString(),
      endTime: new Date(this.formGroupNew.value.endTime).toISOString(),
      disabled: this.formGroupNew.value.disabled,
    };
    this.popupAPI.addPopup(popup).subscribe(() => {
      this.getPopupList();
    });

    this.formGroupNew = this.formBuilder.group({
      'name': ['', Validators.required],
      'link': ['', null],
      'code': ['', null],
      'freq': ['day', Validators.required],
      'terminate': ['view', Validators.required],
      'startTime': ['', Validators.required],
      'endTime': ['', Validators.required],
      'disabled': [true, null],
    });
    this.showNewForm = false;
  }

  updatePopup() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    if (this.expandedRow && this.expandedRow.id) {
      this.expandedRow.name = this.formGroup.value.name;
      this.expandedRow.link = this.formGroup.value.link;
      this.expandedRow.code = this.formGroup.value.code;
      this.expandedRow.freq = this.formGroup.value.freq;
      this.expandedRow.terminate = this.formGroup.value.terminate;
      this.expandedRow.startTime = new Date(this.formGroup.value.startTime).toISOString();
      this.expandedRow.endTime = new Date(this.formGroup.value.endTime).toISOString();
      this.expandedRow.link = this.formGroup.value.link;
      this.expandedRow.disabled = this.formGroup.value.disabled;

      this.popupAPI.updatePopup(this.expandedRow.id, this.expandedRow).subscribe();
    }
  }

  deletePopup() {
    if (this.expandedRow && this.expandedRow.id) {
      this.popups.splice(this.popups.indexOf(this.expandedRow), 1);
      this.table?.renderRows();
      this.popupAPI.removePopup(this.expandedRow.id).subscribe();
    }
  }

  changePopup(event: ContentChangeEvent) {
    if (this.expandedRow && this.expandedRow.id) {
      this.expandedRow.image = event.hash;
      this.popupAPI.updatePopup(this.expandedRow.id, this.expandedRow).subscribe();
    }
  }

  dropPopup(event: CdkDragDrop<Popup[]>) {
    moveItemInArray(this.popups, event.previousIndex, event.currentIndex);
    this.popups.forEach((popup, index) => {
      if (popup.sequence != index) {
        popup.sequence = index;
        if (popup.id) {
          this.popupAPI.updatePopup(popup.id, popup).subscribe();
        }
      }
    });
    this.table?.renderRows();
  }

}
