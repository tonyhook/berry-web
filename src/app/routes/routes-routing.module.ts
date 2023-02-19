import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../core';

import { HomeComponent } from '../layout/home/home.component';
import { AdminComponent } from '../layout/admin/admin.component';
import { MainComponent } from './admin/main/main.component';
import { LoginComponent } from './admin/login/login.component';
import { LogoutComponent } from './admin/logout/logout.component';
import { PendingComponent } from './admin/pending/pending.component';

import { MenuManagerComponent } from './admin/main/manager/menu/menu.component';
import { AuthorityManagerComponent } from './admin/main/manager/authority/authority.component';
import { RoleManagerComponent } from './admin/main/manager/role/role.component';
import { UserManagerComponent } from './admin/main/manager/user/user.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: MainComponent,
        canActivate: [ AuthGuard ],
        children: [
          {
            path: 'backend/menu',
            component: MenuManagerComponent,
          },
          {
            path: 'backend/menu/:id',
            component: MenuManagerComponent,
          },
          {
            path: 'security/authority',
            component: AuthorityManagerComponent,
          },
          {
            path: 'security/role',
            component: RoleManagerComponent,
          },
          {
            path: 'security/user',
            component: UserManagerComponent,
          },
        ],
      },
      {
        path: 'pending',
        component: PendingComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class RoutesRoutingModule { }
