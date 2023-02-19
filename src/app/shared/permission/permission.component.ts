import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';

import { Permission, Role, PermissionAPI, RoleAPI, ManagedResource } from '../../core';

@Component({
  selector: 'berry-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss'],
})
export class PermissionComponent implements OnInit, OnChanges {
  itemPermissions: Permission[] = [];
  inheritedPermissions: Permission[] = [];
  fullPermissions: Permission[] = [];
  inherited = false;
  inheritedPermissionId = 0;
  inheritedFormGroup: UntypedFormGroup = this.formBuilder.group({});
  permissionFormGroup: UntypedFormGroup = this.formBuilder.group({});
  ops = '';
  roles: Role[] = [];
  displayedColumns: string[] = ['roleId', 'permission'];
  @Input() item: ManagedResource | null = null;
  @Input() itemType = '';

  /*
      Class Permission Rules

      resourceType    resourceId  role    permission  rule
      ------------    ----------  ----    ----------  ---------------------------------------
      T               null        R       P           R has P for class of T

      Item Permission Rules

      resourceType    resourceId  role    permission  rule
      ------------    ----------  ----    ----------  ---------------------------------------------------------------------
      T               I           null    null        I inherits permissions from it's parent (HierarchyManagedResource)
      T               I           null    null        I inherits permissions from it's container (ContainedManagedResource)
      T               I           R       P           R has P for I
  */

  constructor(
    private formBuilder: UntypedFormBuilder,
    private permissionAPI: PermissionAPI,
    private roleAPI: RoleAPI,
  ) {
  }

  ngOnInit() {
    this.inheritedFormGroup = this.formBuilder.group({
      'inherited': [this.inherited, null],
    });
    this.permissionFormGroup = this.formBuilder.group({
      'roleid': [0, null],
      'create': [false, null],
      'read':   [false, null],
      'update': [false, null],
      'delete': [false, null],
    });
    this.roleAPI.getRoleList({
      page: 0, size: 1048576, sort: {property: 'id', order: 'asc'}
    }).subscribe(data => {
      this.roles = data.content;
    });
  }

  ngOnChanges() {
    this.updatePermissionList();
  }

  updatePermissionList() {
    this.itemPermissions = [];
    this.inheritedPermissions = [];
    this.fullPermissions = [];
    this.inherited = false;

    if (this.item && this.item.id) {
      this.permissionAPI.getItemPermissionList(this.itemType, this.item.id).subscribe(data => {
        this.itemPermissions = data;
        let inheritedPermissionIndex = -1;
        this.itemPermissions.forEach((permission, index) => {
          if (permission.permission == null && permission.id) {
            this.inherited = true;
            this.inheritedPermissionId = permission.id;
            inheritedPermissionIndex = index
          }
        });
        if (this.inherited) {
          this.itemPermissions.splice(inheritedPermissionIndex, 1);
        }

        this.inheritedFormGroup = this.formBuilder.group({
          'inherited': [this.inherited, null],
        });
      });

      this.permissionAPI.getInheritedPermissionList(this.itemType, this.item.id).subscribe(data => {
        this.inheritedPermissions = data;
      });

      this.permissionAPI.getFullPermissionList(this.itemType, this.item.id).subscribe(data => {
        this.fullPermissions = data;
      });
    }
  }

  toggleInherited() {
    this.inherited = this.inheritedFormGroup.value.inherited;
    if (this.inherited && this.item && this.item.id) {
      const permission: Permission = {
        id: null,
        resourceType: this.itemType,
        resourceId: this.item.id,
        roleId: null,
        permission: null,
      }
      this.permissionAPI.addPermission(permission).subscribe(() => {
        this.updatePermissionList();
      });
    } else {
      this.permissionAPI.removePermission(this.inheritedPermissionId).subscribe(() => {
        this.updatePermissionList();
      });
    }
  }

  toggleOps() {
    this.ops = '';
    if (this.permissionFormGroup.value.create) {
      this.ops += 'c';
    }
    if (this.permissionFormGroup.value.read) {
      this.ops += 'r';
    }
    if (this.permissionFormGroup.value.update) {
      this.ops += 'u';
    }
    if (this.permissionFormGroup.value.delete) {
      this.ops += 'd';
    }
  }

  addPermission() {
    if (this.item && this.item.id) {
      const permission: Permission = {
        id: null,
        resourceType: this.itemType,
        resourceId: this.item.id,
        roleId: null,
        permission: null,
      }

      if (this.permissionFormGroup.value.roleid == 0) {
        permission.roleId = null;
      } else {
        permission.roleId = this.permissionFormGroup.value.roleid;
      }

      let ops = '';
      if (this.permissionFormGroup.value.create) {
        ops += 'c';
      }
      if (this.permissionFormGroup.value.read) {
        ops += 'r';
      }
      if (this.permissionFormGroup.value.update) {
        ops += 'u';
      }
      if (this.permissionFormGroup.value.delete) {
        ops += 'd';
      }
      permission.permission = ops;

      this.permissionAPI.addPermission(permission).subscribe(() => {
        this.updatePermissionList();
      });
    }
  }

}
