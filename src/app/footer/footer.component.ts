import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

/**
 * FooterComponent
 * Muestra el pie de página general del sitio, incluyendo enlaces rápidos y redes sociales.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  /**
   * Estado del usuario autenticado (opcional, no se utiliza actualmente en la plantilla).
   */
  loggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

}
