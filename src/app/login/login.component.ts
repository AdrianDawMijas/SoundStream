import { Component } from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    NgClass
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
