import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { SHARED_MATERIAL_MODULES } from './shared-material.module';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SwiperModule } from 'swiper/angular';
import { CKEditorModule } from 'ckeditor4-angular';

import { OperationComponent } from './operation/operation.component'
import { PermissionComponent } from './permission/permission.component'
import { TreeViewComponent } from './treeview/treeview.component'
import { ImageUploaderComponent } from './imageuploader/imageuploader.component'
import { VideoUploaderComponent } from './videouploader/videouploader.component'
import { PdfUploaderComponent } from './pdfuploader/pdfuploader.component'

import { SimpleDialogComponent } from './simpledialog/simpledialog.component'

import { GetRoleNamePipe } from './pipe/get-role-name.pipe'
import { GetUserNamePipe } from './pipe/get-user-name.pipe'

const THIRDMODULES: Array<Type<unknown> | unknown[]> = [
  PdfViewerModule,
  SwiperModule,
  CKEditorModule,
];

const COMPONENTS: Array<Type<unknown> | unknown[]> = [
  OperationComponent,
  PermissionComponent,
  TreeViewComponent,
  ImageUploaderComponent,
  VideoUploaderComponent,
  PdfUploaderComponent,
  SimpleDialogComponent
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
    DragDropModule,
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
    DragDropModule,
    ...SHARED_MATERIAL_MODULES,
    ...THIRDMODULES,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
})
export class SharedModule { }
