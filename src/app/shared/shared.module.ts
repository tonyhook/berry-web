import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SHARED_MATERIAL_MODULES } from './shared-material.module';

const THIRDMODULES: Array<Type<unknown> | unknown[]> = [];

const COMPONENTS: Array<Type<unknown> | unknown[]> = [];
const DIRECTIVES: Array<Type<unknown> | unknown[]> = [];
const PIPES: Array<Type<unknown> | unknown[]> = [];

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
