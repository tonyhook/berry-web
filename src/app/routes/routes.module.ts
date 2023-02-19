import { NgModule } from '@angular/core';

import { SharedModule } from '../shared';

import { MainComponent } from './admin/main/main.component';
import { MenuComponent } from './admin/main/menu/menu.component';
import { MenuItemComponent } from './admin/main/menu/menu-item/menu-item.component';
import { LoginComponent } from './admin/login/login.component';
import { LogoutComponent } from './admin/logout/logout.component';
import { PendingComponent } from './admin/pending/pending.component';

import { RoutesRoutingModule } from './routes-routing.module';

const COMPONENTS = [
  MainComponent,
  MenuComponent,
  MenuItemComponent,
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
