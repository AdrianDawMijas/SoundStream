import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-duration-panel',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './duration-panel.component.html',
  styleUrls: ['./duration-panel.component.css']
})
export class DurationPanelComponent {
  selectedDuration = 30; // minutos
}
