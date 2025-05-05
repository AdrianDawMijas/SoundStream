import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-energy-panel',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './energy-panel.component.html',
  styleUrls: ['./energy-panel.component.css']
})
export class EnergyPanelComponent {
  energyLevels = ['Low', 'Original', 'High'];
  selectedEnergy = 'Original';

  getEnergy(): string {
    return this.selectedEnergy;
  }
}
