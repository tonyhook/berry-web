import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Authority, AuthorityAPI, PaginatedDataSource, Sort } from '../../../../../core';

@Component({
  selector: 'berry-authority-manager',
  templateUrl: './authority.component.html',
  styleUrls: ['./authority.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AuthorityManagerComponent implements AfterViewInit {
  displayedColumns: string[] = ['name'];
  initialSort: Sort<Authority> = {property: 'id', order: 'asc'};
  expandedRow: Authority | null = null;
  showNewForm = false;
  formGroup: UntypedFormGroup = this.formBuilder.group({
    'name': ['name', Validators.required],
  });
  formGroupNew: UntypedFormGroup = this.formBuilder.group({
    'name': ['', Validators.required],
  });
  @ViewChild(MatSort, {static: true}) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  data = new PaginatedDataSource<Authority, null>(
    (request) => this.authorityAPI.getAuthorityList(request),
    this.initialSort,
    null,
    10
  );

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authorityAPI: AuthorityAPI,
  ) { }

  ngAfterViewInit() {
    if (this.sort) {
      this.sort.sortChange.subscribe(sort => {
        if (sort.direction == '') {
          sort.active = this.initialSort.property;
          sort.direction = this.initialSort.order;
        }
        this.data.sortBy({property: sort.active as keyof Authority, order: sort.direction});
      });
    }
  }

  selectAuthority(row: Authority) {
    this.expandedRow = this.expandedRow == row ? null : row;

    if (this.expandedRow) {
      this.formGroup = this.formBuilder.group({
        'name': [this.expandedRow.name, Validators.required],
      });
    }
  }

  newAuthority() {
    if (!this.formGroupNew.valid) {
      this.formGroupNew.markAllAsTouched();
      return;
    }

    const authority: Authority = {
      id: null,
      name: this.formGroupNew.value.name,
    };
    this.authorityAPI.addAuthority(authority).subscribe(() => {
      if (this.paginator) {
        this.data.fetch(this.paginator.pageIndex);
      }
    });
    this.formGroupNew = this.formBuilder.group({
      'name': ['', Validators.required],
    });
    this.showNewForm = false;
  }

  updateAuthority() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    if (this.expandedRow) {
      const authority: Authority = this.expandedRow;
      authority.name = this.formGroup.value.name;
      if (authority.id) {
        this.authorityAPI.updateAuthority(authority.id, authority).subscribe(() => {
          if (this.paginator) {
            this.data.fetch(this.paginator.pageIndex);
          }
        });
      }
    }
  }

  deleteAuthority() {
    if (this.expandedRow) {
      const authority: Authority = this.expandedRow;
      if (authority.id) {
        this.authorityAPI.removeAuthority(authority.id).subscribe(() => {
          if (this.paginator) {
            this.data.fetch(this.paginator.pageIndex);
          }
        });
      }
    }
  }

}
