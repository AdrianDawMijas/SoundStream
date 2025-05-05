import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tempo-panel',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './tempo-panel.component.html',
  styleUrls: ['./tempo-panel.component.css']
})
export class TempoPanelComponent {
  tempo = 80;

  // ✅ Getter para el componente padre
  getSelectedTempo(): number {
    return this.tempo;
  }
}
