import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './admin/header/header.component';
import { FooterComponent } from './admin/footer/footer.component';

const FRAMEWORKCOMPONENTS = [
  AdminComponent,
  HomeComponent,
];

const ADMINCOMPONENTS = [
  HeaderComponent,
  FooterComponent,
];

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ...FRAMEWORKCOMPONENTS,
    ...ADMINCOMPONENTS,
  ],
  exports: [
    ...FRAMEWORKCOMPONENTS,
    ...ADMINCOMPONENTS,
  ],
})
export class LayoutModule { }
