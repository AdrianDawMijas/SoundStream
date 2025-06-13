// Importación de decoradores y módulos Angular necesarios
import { Component, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { AuthService } from '../service/auth.service';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css'],
  imports: [NgIf, NgForOf, NgClass]
})
export class PricingComponent implements OnInit {

  // Estado de visualización de precios: mensual (true) o anual (false)
  isMonthly = true;

  // Mensaje de estado o error que se mostrará al usuario
  feedback = '';

  // Suscripción actual del usuario (por defecto: FREE)
  currentSubscription = 'FREE';

  // Lista de planes disponibles con sus precios mensual/anual y ID
  plans = [
    { name: 'Free', monthly: 0, annual: 0, id: 1 },
    { name: 'Personal', monthly: 10, annual: 8, id: 2 },
    { name: 'Pro', monthly: 30, annual: 24, id: 3 }
  ];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  // Al iniciar el componente, se obtiene el tipo de suscripción del usuario
  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user?.subscriptionType) {
      this.currentSubscription = user.subscriptionType;
    }
  }

  // Cambia el modo de visualización de precios (mensual o anual)
  togglePricing(): void {
    this.isMonthly = !this.isMonthly;
  }

  // Selección de un plan de suscripción por parte del usuario
  selectPlan(plan: any): void {
    let user = this.authService.getCurrentUser();

    // Verifica si el usuario está logueado
    if (!user) {
      this.feedback = '⚠️ Debes iniciar sesión.';
      return;
    }

    // Si ya tiene el plan seleccionado, muestra mensaje informativo
    if (this.currentSubscription === plan.name.toUpperCase()) {
      this.feedback = `ℹ️ Ya tienes el plan ${plan.name}`;
      return;
    }

    // Se obtiene nuevamente el usuario actualizado
    user = this.authService.getCurrentUser();

    // Llamada al servicio para actualizar la suscripción
    // @ts-ignore necesario por inferencia limitada del tipo
    this.userService.updateSubscription(user.id, plan.id).subscribe({
      next: () => {
        this.feedback = `✅ Suscripción actualizada a ${plan.name}`;
        this.currentSubscription = plan.name.toUpperCase();

        // Actualiza el tipo de suscripción en el objeto del usuario actual
        // @ts-ignore
        user.subscriptionType = plan.name.toUpperCase();
        this.authService.getCurrentUser();
      },
      error: () => {
        this.feedback = '❌ Error al actualizar suscripción';
      }
    });
  }
}
