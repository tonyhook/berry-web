import { Component } from '@angular/core';

import { AuthService, DrawerService } from '../../../core';

@Component({
  selector: 'berry-admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  title = 'Berry';

  constructor(
    public authService: AuthService,
    public drawerService: DrawerService,
  ) { }

}
