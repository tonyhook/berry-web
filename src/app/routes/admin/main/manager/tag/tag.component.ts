import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { PaginatedDataSource, Sort, Tag, TagAPI } from '../../../../../core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'berry-tag-manager',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TagManagerComponent implements OnInit, AfterViewInit {
  type = '';

  displayedColumns: string[] = ['name'];
  initialSort: Sort<Tag> = {property: 'name', order: 'asc'};
  expandedRow: Tag | null = null;
  showNewForm = false;
  formGroup: FormGroup = this.formBuilder.group({
    'name': ['name', Validators.required],
    'disabled': [false, null],
  });
  formGroupNew: FormGroup = this.formBuilder.group({
    'name': ['', Validators.required],
    'disabled': [true, null],
  });
  @ViewChild(MatSort, {static: false}) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  data = new PaginatedDataSource<Tag, null>(
    (request) => this.tagAPI.getTagList(this.type, request),
    this.initialSort,
    null,
    10
  );

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private tagAPI: TagAPI,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['type'] != null) {
        if (this.type != params['type']) {
          this.type = params['type'];
          this.data = new PaginatedDataSource<Tag, null>(
            (request) => this.tagAPI.getTagList(this.type, request),
            this.initialSort,
            null,
            10
          );
        }
      }
    });
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.sort.sortChange.subscribe(sort => {
        if (sort.direction == '') {
          sort.active = this.initialSort.property;
          sort.direction = this.initialSort.order;
        }

        this.data.sortBy({property: sort.active as keyof Tag, order: sort.direction});
      });
    }
  }

  selectTag(row: Tag) {
    this.expandedRow = this.expandedRow == row ? null : row;

    if (this.expandedRow) {
      this.formGroup = this.formBuilder.group({
        'name': [this.expandedRow.name, null],
        'disabled': [this.expandedRow.disabled, null],
      });
    }
  }

  newTag() {
    if (!this.formGroupNew.valid) {
      this.formGroupNew.markAllAsTouched();
      return;
    }

    const tag: Tag = {
      id: null,
      type: this.type,
      name: this.formGroupNew.value.name,
      disabled: this.formGroupNew.value.disabled,
    };
    this.tagAPI.addTag(tag).subscribe(() => {
      if (this.paginator) {
        this.data.fetch(this.paginator.pageIndex);
      }
    });
    this.formGroupNew = this.formBuilder.group({
      'name': ['', Validators.required],
      'disabled': [true, null],
    });
    this.showNewForm = false;
  }

  updateTag() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    if (this.expandedRow) {
      const tag: Tag = this.expandedRow;
      tag.name = this.formGroup.value.name;
      tag.disabled = this.formGroup.value.disabled;
      if (tag.id) {
        this.tagAPI.updateTag(tag.id, tag).subscribe(() => {
          if (this.paginator) {
            this.data.fetch(this.paginator.pageIndex);
          }
        });
      }
    }
  }

  deleteTag() {
    if (this.expandedRow) {
      const tag: Tag = this.expandedRow;
      if (tag.id) {
        this.tagAPI.removeTag(tag.id).subscribe(() => {
          if (this.paginator) {
            this.data.fetch(this.paginator.pageIndex);
          }
        });
      }
    }
  }

}
