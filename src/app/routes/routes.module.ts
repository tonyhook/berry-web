import { NgModule } from '@angular/core';

import { SharedModule } from '../shared';

import { MainComponent } from './admin/main/main.component';
import { LoginComponent } from './admin/login/login.component';
import { LogoutComponent } from './admin/logout/logout.component';
import { PendingComponent } from './admin/pending/pending.component';

import { RoutesRoutingModule } from './routes-routing.module';

const COMPONENTS = [
  MainComponent,
  LoginComponent,
  LogoutComponent,
  PendingComponent,
];

@NgModule({
  imports: [
    SharedModule,
    RoutesRoutingModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
})
export class RoutesModule { }
