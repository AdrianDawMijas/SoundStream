import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent {
  isMonthly: boolean = true; // Estado del plan (true = mensual, false = anual)

  // Lista de precios para cada tipo de plan
  plans = [
    { name: 'Free', monthly: 0, annual: 0 },
    { name: 'Personal', monthly: 10, annual: 8 }, // 100 = $10 x 10 meses (descuento)
    { name: 'Pro', monthly: 30, annual: 24 }
  ];

  togglePricing() {
    this.isMonthly = !this.isMonthly; // Alternar entre mensual y anual
  }
}
