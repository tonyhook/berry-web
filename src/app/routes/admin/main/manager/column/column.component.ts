import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';

import { ItemChangeEvent, ItemDeleteEvent, ItemNewEvent, ItemSelectEvent } from 'src/app/shared/treeview/treeview.component';
import { Column, ColumnAPI } from '../../../../../core';

@Component({
  selector: 'berry-column-manager',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnManagerComponent implements OnInit {
  columns: Column[] = [];
  column: Column | null = null;
  formGroup: UntypedFormGroup = this.formBuilder.group({});

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private columnAPI: ColumnAPI,
  ) { }

  ngOnInit() {
    combineLatest([
      this.columnAPI.getColumnList(),
      this.route.params,
    ]).subscribe(results => {
      this.columns = results[0];

      if (results[1]['id'] != null) {
        this.setCurrentColumn(+results[1]['id']);
      } else {
        this.column = null;
      }
    });
  }

  setCurrentColumn(id: number) {
    if (this.columns == null) {
      return;
    }

    const column = this.columns.find(column => column.id == id);

    if (column != undefined) {
      this.column = column;

      this.formGroup = this.formBuilder.group({
        'name': [this.column.name, Validators.required],
        'disabled': [this.column.disabled, null],
        'description': [this.column.description, null],
      });
    } else {
      this.router.navigateByUrl('/admin/cms/column');
    }
  }

  changeColumnItem(event: ItemChangeEvent) {
    const column = this.columns.find(column => column.id == event.id);

    if (typeof column !== 'undefined' && column.id) {
      if (event.type == 'sequence') {
        if (event.newValue != null) {
          column.sequence = event.newValue;
        } else {
          column.sequence = 0;
        }
      }
      if (event.type == 'parent') {
        column.parentId = event.newValue;
      }

      this.columnAPI.updateColumn(column.id, column).subscribe();
    }
  }

  selectColumnItem(event: ItemSelectEvent) {
    this.router.navigate(['admin', 'cms', 'column', event.id]);
  }

  newColumnItem(event: ItemNewEvent) {
    const column: Column = {
      id: null,
      ownerId: null,
      name: event.name,
      parentId: event.parentId,
      sequence: event.sequence,
      disabled: true,
    }

    this.columnAPI.addColumn(column).subscribe(data => {
      const column = data;
      this.columnAPI.getColumnList().subscribe(data => {
        this.columns = data;
        if (column.id) {
          this.selectColumnItem({ id: column.id });
        }
      });
    });
  }

  deleteColumnItem(event: ItemDeleteEvent) {
    const column = this.columns.find(column => column.id == event.id);

    if (column && column.id) {
      this.columnAPI.removeColumn(column.id).subscribe(() => {
        this.columnAPI.getColumnList().subscribe(data => {
          this.columns = data;
        });
      });
    }

    if (column && column.parentId) {
      this.router.navigate(['admin', 'cms', 'column', column.parentId]);
    } else {
      this.router.navigate(['admin', 'cms', 'column']);
    }
  }

  updateColumn() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    if (this.column && this.column.id) {
      this.column.name = this.formGroup.value.name;
      this.column.disabled = this.formGroup.value.disabled;
      this.column.description = this.formGroup.value.description;
      this.columnAPI.updateColumn(this.column.id, this.column).subscribe(() => {
        this.columnAPI.getColumnList().subscribe(data => {
          this.columns = data;
        });
      });
    }
  }

}
