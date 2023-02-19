import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { PaginatedDataSource, Role, RoleAPI, Sort, User, UserAPI } from '../../../../../core';

@Component({
  selector: 'berry-user-manager',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UserManagerComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['username'];
  displayedRoleColumns: string[] = ['name'];
  initialSort: Sort<User> = {property: 'id', order: 'asc'};
  expandedRow: User | null = null;
  roles: Role[] = [];
  userRoleSet: Set<number> = new Set<number>();
  showNewForm = false;
  formGroup: UntypedFormGroup = this.formBuilder.group({
    'username': ['username', Validators.required],
    'password': ['password', Validators.required],
    'enabled': [true, null],
  });
  formGroupNew: UntypedFormGroup = this.formBuilder.group({
    'username': ['', Validators.required],
    'password': ['', Validators.required],
    'enabled': [true, null],
  });
  @ViewChild(MatSort, {static: true}) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  data = new PaginatedDataSource<User, null>(
    (request) => this.userAPI.getUserList(request),
    this.initialSort,
    null,
    10
  );

  constructor(
    private formBuilder: UntypedFormBuilder,
    private roleAPI: RoleAPI,
    private userAPI: UserAPI,
  ) { }

  ngOnInit() {
    this.roleAPI.getRoleList({
      page: 0, size: 1048576, sort: {property: 'id', order: 'asc'}
    }).subscribe(data => {
      this.roles = data.content;
    });
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.sort.sortChange.subscribe(sort => {
        if (sort.direction == '') {
          sort.active = this.initialSort.property;
          sort.direction = this.initialSort.order;
        }
        this.data.sortBy({property: sort.active as keyof User, order: sort.direction});
      });
    }
  }

  selectUser(row: User) {
    this.expandedRow = this.expandedRow == row ? null : row;

    if (!this.expandedRow) {
      return;
    }

    this.formGroup = this.formBuilder.group({
      'username': [this.expandedRow.username, Validators.required],
      'password': ['********', Validators.required],
      'enabled': [this.expandedRow.enabled, Validators.required],
    });

    this.userRoleSet.clear();
    this.expandedRow.roles.forEach(role => {
      if (role.id) {
        this.userRoleSet.add(role.id);
      }
    });
  }

  newUser() {
    if (!this.formGroupNew.valid) {
      this.formGroupNew.markAllAsTouched();
      return;
    }

    const user: User = {
      id: null,
      username: this.formGroupNew.value.username,
      password: this.formGroupNew.value.password,
      enabled: this.formGroupNew.value.enabled,
      roles: [],
    };
    this.userAPI.addUser(user).subscribe(() => {
      if (this.paginator) {
        this.data.fetch(this.paginator.pageIndex);
      }
    });
    this.formGroupNew = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required],
      'enabled': [true, null],
    });
    this.showNewForm = false;
  }

  updateUser() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    if (this.expandedRow) {
      const user: User = this.expandedRow;
      user.username = this.formGroup.value.username;
      if (this.formGroup.controls['password'].touched) {
        user.password = this.formGroup.value.password;
      } else {
        user.password = null;
      }
      user.enabled = this.formGroup.value.enabled;
      if (user.id) {
        this.userAPI.updateUser(user.id, user).subscribe(() => {
          if (this.paginator) {
            this.data.fetch(this.paginator.pageIndex);
          }
        });
      }
    }
  }

  deleteUser() {
    if (this.expandedRow) {
      const user: User = this.expandedRow;
      if (user.id) {
        this.userAPI.removeUser(user.id).subscribe(() => {
          if (this.paginator) {
            this.data.fetch(this.paginator.pageIndex);
          }
        });
      }
    }
  }

  touchPassword() {
    if (this.formGroup.controls['password'].touched) {
      return;
    }

    this.formGroup.controls['password'].setValue('');
  }

  toggleRole(roleId: number, event: MatCheckboxChange) {
    this.roleAPI.getRole(roleId).subscribe(data => {
      if (this.expandedRow) {
        const user: User = this.expandedRow;
        const role: Role = data;

        if (event.checked) {
          user.roles.push(role);
        } else {
          let index = -1;
          for (let i = 0; i < user.roles.length; i++) {
            if (user.roles[i].id == roleId) {
              index = i;
            }
          }
          user.roles.splice(index, 1);
        }

        if (user.id) {
          this.userAPI.updateUser(user.id, user).subscribe();
        }
      }
    });
  }

}
