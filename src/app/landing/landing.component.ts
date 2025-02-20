import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements AfterViewInit {

  @ViewChild('bgVideo', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    this.ensureVideoPlays();
  }

  ensureVideoPlays() {
    const video = this.videoElement.nativeElement;

    if (video) {
      video.muted = true;  // Asegurar que está silenciado
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;

      video.play().catch((error) => {
        console.error("No se pudo reproducir el video automáticamente:", error);
      });

      // Verificar si el video se pausa y reiniciarlo cada 3s
      setInterval(() => {
        if (video.paused) {
          video.play();
        }
      }, 3000);
    }
  }
}
