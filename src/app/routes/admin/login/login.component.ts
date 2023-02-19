import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../../core';

@Component({
  selector: 'berry-admin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  hide = true;
  formGroup: UntypedFormGroup = this.formBuilder.group({
    'username': [null, Validators.required],
    'password': [null, Validators.required],
    'rememberMe': [null, null],
  });

  constructor(
    private authService: AuthService,
    private formBuilder: UntypedFormBuilder,
  ) { }

  login() {
    if (this.formGroup.valid) {
      this.authService.login(this.formGroup.value);
    }
  }

}
