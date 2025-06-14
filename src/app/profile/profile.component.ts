import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, LoginResponseDTO } from '../service/auth.service';
import { Router } from '@angular/router';
import { UserlistcomponentComponent } from '../userlistcomponent/userlistcomponent.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, UserlistcomponentComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // Datos del usuario actual
  user: LoginResponseDTO | null = null;

  // Indica si el usuario es administrador
  isAdmin: boolean = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  // Se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
  }

  // Cierra la sesión y redirige al inicio
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
