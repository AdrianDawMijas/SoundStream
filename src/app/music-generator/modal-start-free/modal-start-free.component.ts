import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-modal-start-free',
  standalone: true, // ✅ Añade esto
  imports: [RouterLink], // ✅ Ahora sí es válido
  templateUrl: './modal-start-free.component.html',
  styleUrls: ['./modal-start-free.component.css']
})
export class ModalStartFreeComponent {
  @Output() close = new EventEmitter<void>();

  dismiss(): void {
    this.close.emit();
  }
}
