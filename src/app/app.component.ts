import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
    NgIf
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) {
  }

  // Función para verificar si estamos en la ruta 'music'
  isMusicRoute(): boolean {
    return this.router.url.includes('/music');
  }

  isLanding(): boolean {
    return this.router.url ===('/');
  }

  hideFooterRoutes(): boolean {
    return this.router.url.includes('/music') || this.router.url.includes('/library');
  }
}
