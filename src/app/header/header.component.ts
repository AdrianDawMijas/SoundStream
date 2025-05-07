import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {NgClass, NgIf} from '@angular/common';
import { AuthService } from '../service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, NgClass],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  loggedIn = false;
  userName: string = '';
  isAdmin = false;
  private loginSub!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginSub = this.authService.isLoggedIn$.subscribe(isLogged => {
      this.loggedIn = isLogged;

      const storedUser = localStorage.getItem('user');
      if (isLogged && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          this.userName = user.nombre || user.email || 'User';

          // ✅ Verificación admin (por nombre o email)
          this.isAdmin = user.email === 'admin@admin.com' || user.nombre?.toLowerCase() === 'admin';
        } catch (e) {
          this.userName = 'User';
          this.isAdmin = false;
        }
      } else {
        this.userName = '';
        this.isAdmin = false;
      }
    });
  }

  logout(): void {
    this.authService.logoutUser();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
  }

  closeMenu(): void {
    const offcanvas = document.querySelector('#offcanvasNavbar');
    if (offcanvas && (offcanvas as any).classList.contains('show')) {
      (window as any).bootstrap?.Offcanvas.getInstance(offcanvas)?.hide();
    }
  }
}
