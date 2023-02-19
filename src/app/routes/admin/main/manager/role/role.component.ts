import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Authority, AuthorityAPI, PaginatedDataSource, Permission, PermissionAPI, Role, RoleAPI, Sort } from '../../../../../core';

@Component({
  selector: 'berry-role-manager',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RoleManagerComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name'];
  displayedAuthorityColumns: string[] = ['name'];
  displayedResourceTypeColumns: string[] = ['type', 'permission'];
  initialSort: Sort<Role> = {property: 'id', order: 'asc'};
  expandedRow: Role | null = null;
  authorities: Authority[] = [];
  roleAuthoritySet: Set<number> = new Set<number>();
  resourcesTypes: string[] = [];
  rolePermissionMap: Map<string, Permission> = new Map<string, Permission>();
  showNewForm = false;
  formGroup: UntypedFormGroup = this.formBuilder.group({
    'name': ['name', Validators.required],
  });
  formGroupNew: UntypedFormGroup = this.formBuilder.group({
    'name': ['', Validators.required],
  });
  @ViewChild(MatSort, {static: true}) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  data = new PaginatedDataSource<Role, null>(
    (request) => this.roleAPI.getRoleList(request),
    this.initialSort,
    null,
    10
  );

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authorityAPI: AuthorityAPI,
    private permissionAPI: PermissionAPI,
    private roleAPI: RoleAPI,
  ) { }

  ngOnInit() {
    this.authorityAPI.getAuthorityList({
      page: 0, size: 1048576, sort: {property: 'id', order: 'asc'}
    }).subscribe(data => {
      this.authorities = data.content;
    });
    this.permissionAPI.getResourceTypeList().subscribe(data => {
      this.resourcesTypes = data;
    });
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.sort.sortChange.subscribe(sort => {
        if (sort.direction == '') {
          sort.active = this.initialSort.property;
          sort.direction = this.initialSort.order;
        }
        this.data.sortBy({property: sort.active as keyof Role, order: sort.direction});
      });
    }
  }

  selectRole(row: Role) {
    this.expandedRow = this.expandedRow == row ? null : row;

    if (!this.expandedRow) {
      return;
    }

    this.formGroup = this.formBuilder.group({
      'name': [this.expandedRow.name, Validators.required],
    });

    this.roleAuthoritySet.clear();
    this.expandedRow.authorities.forEach(authority => {
      if (authority.id) {
        this.roleAuthoritySet.add(authority.id);
      }
    });

    this.rolePermissionMap.clear();
    this.resourcesTypes.forEach(resourceType => {
      this.permissionAPI.getClassPermissionList(resourceType).subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          if (this.expandedRow && data[i].roleId == this.expandedRow.id) {
            this.rolePermissionMap.set(resourceType, data[i]);
          }
        }
      });
    });
  }

  newRole() {
    if (!this.formGroupNew.valid) {
      this.formGroupNew.markAllAsTouched();
      return;
    }

    const role: Role = {
      id: null,
      name: this.formGroupNew.value.name,
      authorities: [],
    };
    this.roleAPI.addRole(role).subscribe(() => {
      if (this.paginator) {
        this.data.fetch(this.paginator.pageIndex);
      }
    });
    this.formGroupNew = this.formBuilder.group({
      'name': ['', Validators.required],
    });
    this.showNewForm = false;
  }

  updateRole() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    if (this.expandedRow) {
      const role: Role = this.expandedRow;
      role.name = this.formGroup.value.name;
      if (role.id) {
        this.roleAPI.updateRole(role.id, role).subscribe(() => {
          if (this.paginator) {
            this.data.fetch(this.paginator.pageIndex);
          }
        });
      }
    }
  }

  deleteRole() {
    if (this.expandedRow) {
      const role: Role = this.expandedRow;
      if (role.id) {
        this.roleAPI.removeRole(role.id).subscribe(() => {
          if (this.paginator) {
            this.data.fetch(this.paginator.pageIndex);
          }
        });
      }
    }
  }

  toggleAuthority(authorityId: number, event: MatCheckboxChange) {
    this.authorityAPI.getAuthority(authorityId).subscribe(data => {
      if (this.expandedRow) {
        const role: Role = this.expandedRow;
        const authority: Authority = data;

        if (event.checked) {
          role.authorities.push(authority);
        } else {
          let index = -1;
          for (let i = 0; i < role.authorities.length; i++) {
            if (role.authorities[i].id == authorityId) {
              index = i;
            }
          }
          role.authorities.splice(index, 1);
        }

        if (role.id) {
          this.roleAPI.updateRole(role.id, role).subscribe();
        }
      }
    });
  }

  togglePermission(resourceType: string, op: string, event: MatCheckboxChange) {
    let permission: Permission | undefined = this.rolePermissionMap.get(resourceType);

    if (this.expandedRow) {
      if (event.checked) {
        if (typeof permission === 'undefined') {
          permission = {
            id: null,
            resourceType: resourceType,
            resourceId: null,
            roleId: this.expandedRow.id,
            permission: op,
          };

          this.permissionAPI.addPermission(permission).subscribe(data => {
            if (permission) {
              permission.id = data.id;
            }
          });
        } else {
          permission.permission += op;

          if (permission.id) {
            this.permissionAPI.updatePermission(permission.id, permission).subscribe();
          }
        }
      } else {
        if (permission && permission.id && permission.permission) {
          const index = permission.permission.indexOf(op);
          permission.permission = permission.permission.slice(0, index) + permission.permission.slice(index + 1, permission.permission.length);

          if (permission.permission.length == 0) {
            this.permissionAPI.removePermission(permission.id).subscribe();
          } else {
            this.permissionAPI.updatePermission(permission.id, permission).subscribe();
          }
        }
      }

      if (permission) {
        this.rolePermissionMap.set(resourceType, permission);
      }
    }
  }

}
