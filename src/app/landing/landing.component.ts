import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

/**
 * LandingComponent
 * Página de inicio con video de fondo y reproductor interactivo.
 * Incluye CTA, botones de navegación y reproducción de una canción aleatoria.
 */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements AfterViewInit {

  // Referencia al video de fondo
  @ViewChild('bgVideo', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;

  // Elementos de audio y estado
  audio: HTMLAudioElement | null = null;
  currentTitle: string = '';
  progress: number = 0;

  private progressSubscription: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.ensureVideoPlays();

    // Solo carga canción si no viene de login
    const fromLogin = this.route.snapshot.queryParamMap.get('from') === 'login';
    if (!fromLogin) {
      this.loadRandomSong();
    }

    // Pausar audio si la pestaña pierde el foco
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.pauseAudio();
    });

    // Pausar al navegar fuera
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) this.pauseAudio();
    });
  }

  /**
   * Asegura la reproducción del video de fondo incluso en navegadores que la bloquean.
   */
  private ensureVideoPlays(): void {
    const video = this.videoElement.nativeElement;
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;

    video.play().catch(err => {
      console.error("🎥 No se pudo reproducir el video automáticamente:", err);
    });

    // Reintento si se pausa por alguna razón
    setInterval(() => {
      if (video.paused) video.play();
    }, 3000);
  }

  /**
   * Carga una canción aleatoria desde el backend y la reproduce.
   */
  loadRandomSong(): void {
    this.pauseAudio();

    this.http.get<any>('http://localhost:8080/v1/api/songs/random').subscribe(song => {
      if (song?.generatedUrl) {
        this.audio = new Audio(song.generatedUrl);
        this.audio.volume = 0.6;
        this.audio.play().catch(err => console.warn("🎵 No se pudo reproducir la canción:", err));

        this.currentTitle = song.title || 'Untitled';
        this.trackProgress();
      }
    });
  }

  /**
   * Inicia la reproducción manual de la canción.
   */
  playAudio(): void {
    this.audio?.play();
    this.trackProgress();
  }

  /**
   * Pausa la canción actual.
   */
  pauseAudio(): void {
    this.audio?.pause();
    this.stopProgressTracking();
  }

  /**
   * Suscribe un observable para actualizar la barra de progreso.
   */
  private trackProgress(): void {
    this.stopProgressTracking();

    if (this.audio) {
      this.progressSubscription = interval(500).subscribe(() => {
        if (this.audio?.duration) {
          this.progress = (this.audio.currentTime / this.audio.duration) * 100;
        }
      });

      this.audio.onended = () => {
        this.progress = 0;
        this.stopProgressTracking();
      };
    }
  }

  /**
   * Detiene la suscripción de seguimiento de progreso.
   */
  private stopProgressTracking(): void {
    this.progressSubscription?.unsubscribe();
    this.progressSubscription = null;
  }
}
