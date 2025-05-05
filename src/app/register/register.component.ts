import { Component } from '@angular/core';
import {NgClass} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../service/auth.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [
    NgClass,
    RouterLink,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  showPassword: boolean = false;
  email = '';
  password = '';
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  constructor(private authService: AuthService, private router: Router) {
  }

  onRegister() {
    this.authService.register(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Registro correcto', response);
        // Podrías guardar el user en localStorage
        this.router.navigate(['/home']);
      },
      error: () => {
        alert('Credenciales incorrectas');
      }
    });
  }
  }

