import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SHARED_MATERIAL_MODULES } from './shared-material.module';

import { OperationComponent } from './operation/operation.component'
import { PermissionComponent } from './permission/permission.component'
import { TreeViewComponent } from './treeview/treeview.component'

import { GetRoleNamePipe } from './pipe/get-role-name.pipe'
import { GetUserNamePipe } from './pipe/get-user-name.pipe'

const THIRDMODULES: Array<Type<unknown> | unknown[]> = [];

const COMPONENTS: Array<Type<unknown> | unknown[]> = [
  OperationComponent,
  PermissionComponent,
  TreeViewComponent,
];
const DIRECTIVES: Array<Type<unknown> | unknown[]> = [];
const PIPES: Array<Type<unknown> | unknown[]> = [
  GetRoleNamePipe,
  GetUserNamePipe,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ...SHARED_MATERIAL_MODULES,
    ...THIRDMODULES,
  ],
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ...SHARED_MATERIAL_MODULES,
    ...THIRDMODULES,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
})
export class SharedModule { }
