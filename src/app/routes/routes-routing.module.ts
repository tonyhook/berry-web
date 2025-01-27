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
import { LogManagerComponent } from './admin/main/manager/log/log.component';
import { CarouselManagerComponent } from './admin/main/manager/carousel/carousel.component';
import { ColumnManagerComponent } from './admin/main/manager/column/column.component';
import { ContentManagerComponent } from './admin/main/manager/content/content.component';
import { GalleryManagerComponent } from './admin/main/manager/gallery/gallery.component';
import { PopupManagerComponent } from './admin/main/manager/popup/popup.component';
import { TagManagerComponent } from './admin/main/manager/tag/tag.component';
import { TopicManagerComponent } from './admin/main/manager/topic/topic.component';
import { WechatAccountManagerComponent } from './admin/main/manager/wechat-account/wechat-account.component';

import { WechatComponent } from './home/wechat/wechat.component';

import { EntranceComponent } from './home/site/entrance/entrance.component';

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
          {
            path: 'audit/log',
            component: LogManagerComponent,
          },
          {
            path: 'cms/carousel',
            component: CarouselManagerComponent,
          },
          {
            path: 'cms/carousel/:list',
            component: CarouselManagerComponent,
          },
          {
            path: 'cms/column',
            component: ColumnManagerComponent,
          },
          {
            path: 'cms/column/:id',
            component: ColumnManagerComponent,
          },
          {
            path: 'cms/content',
            component: ContentManagerComponent,
          },
          {
            path: 'cms/content/:id',
            component: ContentManagerComponent,
          },
          {
            path: 'cms/gallery',
            component: GalleryManagerComponent,
          },
          {
            path: 'cms/gallery/:type',
            component: GalleryManagerComponent,
          },
          {
            path: 'cms/gallery/:id',
            component: GalleryManagerComponent,
          },
          {
            path: 'cms/popup',
            component: PopupManagerComponent,
          },
          {
            path: 'cms/popup/:list',
            component: PopupManagerComponent,
          },
          {
            path: 'cms/tag',
            component: TagManagerComponent,
          },
          {
            path: 'cms/tag/:type',
            component: TagManagerComponent,
          },
          {
            path: 'cms/topic',
            component: TopicManagerComponent,
          },
          {
            path: 'cms/topic/:type',
            component: TopicManagerComponent,
          },
          {
            path: 'social/wechat-account',
            component: WechatAccountManagerComponent,
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
        path: 'wechat',
        component: WechatComponent,
      },
      {
        path: '',
        component: EntranceComponent,
        children: [
          {
            path: '**',
            redirectTo: '',
          },
        ]
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
