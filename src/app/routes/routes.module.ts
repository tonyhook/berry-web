import { NgModule } from '@angular/core';

import { SharedModule } from '../shared';

import { MainComponent } from './admin/main/main.component';
import { MenuComponent } from './admin/main/menu/menu.component';
import { MenuItemComponent } from './admin/main/menu/menu-item/menu-item.component';
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

import { WechatComponent } from './home/wechat/wechat.component';

import { AgreementComponent } from './home/site/agreement/agreement.component';
import { EntranceComponent } from './home/site/entrance/entrance.component';
import { RegisterComponent } from './home/site/register/register.component';

import { RoutesRoutingModule } from './routes-routing.module';

const COMPONENTS = [
  MainComponent,
  MenuComponent,
  MenuItemComponent,
  LoginComponent,
  LogoutComponent,
  PendingComponent,
  MenuManagerComponent,
  AuthorityManagerComponent,
  RoleManagerComponent,
  UserManagerComponent,
  LogManagerComponent,
  CarouselManagerComponent,
  ColumnManagerComponent,
  ContentManagerComponent,
  GalleryManagerComponent,
  PopupManagerComponent,
  TagManagerComponent,
  TopicManagerComponent,
  WechatComponent,
];

const VISITORCOMPONENTS = [
  AgreementComponent,
  EntranceComponent,
  RegisterComponent,
];

@NgModule({
  imports: [
    SharedModule,
    RoutesRoutingModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...VISITORCOMPONENTS,
  ],
})
export class RoutesModule { }
