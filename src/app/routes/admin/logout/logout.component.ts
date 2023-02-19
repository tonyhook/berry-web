import { Component } from '@angular/core';

import { AuthService } from '../../../core';

@Component({
  selector: 'berry-admin-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {

  constructor(
    private authService: AuthService,
  ) { }

  logout() {
    this.authService.logout();
  }

}
