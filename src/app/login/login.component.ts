import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    FormsModule,
    RouterLink,
    NgClass
  ]
})
export class LoginComponent implements AfterViewInit {
  email = '';
  password = '';
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: '1056065714806-qnno38lp4gh2lvnmthnufkcpibd7m5tj.apps.googleusercontent.com', // ← reemplaza esto con tu client ID real
      callback: this.handleCredentialResponse.bind(this)
    });

    google.accounts.id.renderButton(
      document.getElementById('google-button'),
      {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        width: '100%'
      }
    );
  }

  handleCredentialResponse(response: any) {
    const token = response.credential;
    console.log('Token recibido de Google:', token);

    this.authService.loginWithGoogleToken(token).subscribe({
      next: () => {
        console.log('Login con Google exitoso');
        this.authService.loginUser(response);
        this.router.navigate(['/']);
      },
      error: () => {
        alert('Fallo al iniciar sesión con Google');
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log('Login clásico exitoso');
        localStorage.setItem('user', JSON.stringify(res)); // <- Guardar sesión
        this.authService.loginUser(res); // <- Actualizar estado de login
        this.router.navigate(['/']); // <- Redirigir al landing
      },
      error: () => {
        alert('Credenciales incorrectas');
      }
    });
  }

}
