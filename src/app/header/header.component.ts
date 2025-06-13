import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';

/**
 * HeaderComponent
 * Muestra la barra de navegación superior, incluyendo el menú responsive,
 * opciones visibles según autenticación, y control de sesión del usuario.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, NgClass],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  // Estado del usuario
  loggedIn = false;
  isAdmin = false;
  userName: string = '';

  // Control del tooltip y suscripción al AuthService
  showTooltip = false;
  private loginSub!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Se actualiza el estado del header según login y tipo de usuario
    this.loginSub = this.authService.isLoggedIn$.subscribe((isLogged: boolean) => {
      this.loggedIn = isLogged;

      const user = this.authService.getCurrentUser();
      this.userName = user?.nombre || user?.email || 'User';
      this.isAdmin = this.authService.isAdmin();
    });
  }

  /**
   * Cierra sesión del usuario y redirige al home.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  /**
   * Cierra el menú responsive si está abierto (offcanvas Bootstrap).
   */
  closeMenu(): void {
    const offcanvas = document.querySelector('#offcanvasNavbar');
    if (offcanvas && (offcanvas as any).classList.contains('show')) {
      (window as any).bootstrap?.Offcanvas.getInstance(offcanvas)?.hide();
    }
  }

  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
  }
}
