import { Component } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-gear-panel',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './gear-panel.component.html',
  styleUrls: ['./gear-panel.component.css']
})
export class GearPanelComponent {
  gears = [
    { name: 'Drums', quantity: 0 },
    { name: 'Bass', quantity: 0 },
    { name: 'Guitar', quantity: 0 },
    { name: 'Synth', quantity: 0 },
    { name: 'Strings', quantity: 0 }
  ];

  increase(gear: any) {
    gear.quantity++;
  }

  decrease(gear: any) {
    if (gear.quantity > 0) gear.quantity--;
  }

  getSelectedInstruments(): string[] {
    return this.gears
      .filter(g => g.quantity > 0)
      .map(g => g.name);
  }
}
