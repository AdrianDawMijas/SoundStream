import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

// Declaración del objeto global de Google (para login con OAuth)
declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, RouterLink, NgClass]
})
export class LoginComponent implements AfterViewInit {
  // Datos del formulario
  email = '';
  password = '';
  showPassword = false;  // Controla si se muestra la contraseña en texto plano

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Hook del ciclo de vida que se ejecuta tras cargar la vista.
   * Inicializa el botón de inicio de sesión con Google.
   */
  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: '1056065714806-qnno38lp4gh2lvnmthnufkcpibd7m5tj.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this) // Enlaza correctamente el contexto
    });

    // Renderiza el botón de Google dentro del contenedor con ID específico
    google.accounts.id.renderButton(document.getElementById('google-button'), {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      width: '100%'
    });
  }

  /**
   * Maneja el login clásico con email y contraseña.
   * Redirige al usuario si las credenciales son válidas.
   */
  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/'], { queryParams: { from: 'login' } });
      },
      error: () => {
        alert('Credenciales incorrectas');
      }
    });
  }

  /**
   * Callback que maneja la autenticación con token de Google.
   * Se invoca automáticamente por el SDK de Google al autenticar.
   */
  handleCredentialResponse(response: any) {
    const token = response.credential;

    this.authService.loginWithGoogleToken(token).subscribe({
      next: () => {
        this.router.navigate(['/'], { queryParams: { from: 'login' } });
      },
      error: () => {
        alert('Fallo al iniciar sesión con Google');
      }
    });
  }

  /**
   * Alterna la visibilidad de la contraseña entre oculta y visible.
   */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
