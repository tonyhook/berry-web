import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Login, OpenSecurityAPI, UserDetails } from '..';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  ready = false;
  credential: UserDetails;
  redirectUrl = '/admin';

  constructor(
    private router: Router,
    private security: OpenSecurityAPI,
    private _snackBar: MatSnackBar,
  ) {
    this.getUserDetails();
    this.credential = {username: '', password: null, enabled: false};
  }

  getUserDetails(): void {
    this.ready = false;
    this.security.getUserDetails().subscribe({
      next: data => {
        this.credential = data;
        this.ready = true;
        this.router.navigateByUrl(this.redirectUrl);
      },
      error: () => {
        this._snackBar.open('Failed to get credential', 'Dismiss', {
          duration: 3000
        });
      },
    });
  }

  login(post: Login) {
    this.security.login(post).subscribe({
      next: () => {
        this.getUserDetails();
        this.router.navigate(['/admin/pending']);
      },
      error: error => {
        if (error.status == 0) {
          this._snackBar.open(error.statusText, 'Dismiss', {
            duration: 3000
          });
        } else {
          this._snackBar.open(error.error, 'Dismiss', {
            duration: 3000
          });
        }
      },
    });
  }

  logout() {
    this.security.logout().subscribe({
      next: () => {
        this.getUserDetails();
        this.redirectUrl = '/admin';
        this.router.navigate(['/admin/login']);
      },
      error: error => {
        if (error.status == 0) {
          this._snackBar.open(error.statusText, 'Dismiss', {
            duration: 3000
          });
        } else {
          this._snackBar.open(error.error, 'Dismiss', {
            duration: 3000
          });
        }
      },
    });
  }

}
