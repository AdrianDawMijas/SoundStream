import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {Router, NavigationEnd, RouterLink} from '@angular/router';
import { Offcanvas } from 'bootstrap';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [
    RouterLink
  ],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('offcanvasNavbar', { static: false }) offcanvasNavbar!: ElementRef;
  offcanvasInstance: Offcanvas | null = null;

  constructor(private router: Router) {
    // Escuchar cambios de ruta y cerrar el offcanvas cuando cambia la página
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMenu();
      });
  }

  ngAfterViewInit() {
    if (this.offcanvasNavbar) {
      this.offcanvasInstance = new Offcanvas(this.offcanvasNavbar.nativeElement);
    }
  }

  closeMenu() {
    if (this.offcanvasInstance) {
      this.offcanvasInstance.hide(); // Cierra el menú
    }

    // Asegurarse de que el menú desaparezca completamente
    document.body.classList.remove('offcanvas-open'); // Limpia la clase que oscurece la pantalla
    document.querySelectorAll('.offcanvas-backdrop').forEach(backdrop => backdrop.remove()); // Elimina el fondo oscuro
  }
}
