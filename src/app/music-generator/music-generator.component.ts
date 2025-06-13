// music-generator.component.ts
import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { StructurePanelComponent } from './panels/structure-panel/structure-panel.component';
import { DurationPanelComponent } from './panels/duration-panel/duration-panel.component';
import { EnergyPanelComponent } from './panels/energy-panel/energy-panel.component';
import { TempoPanelComponent } from './panels/tempo-panel/tempo-panel.component';
import { GearPanelComponent } from './panels/gear-panel/gear-panel.component';
import { GenrePanelComponent } from './panels/genre-panel/genre.component';
import { SongService } from './service/song-service.service';
import { AuthService } from '../service/auth.service';
import { ModalStartFreeComponent } from './modal-start-free/modal-start-free.component';
import { PlaylistService } from '../service/playlist.service';

@Component({
  selector: 'app-music-generator',
  standalone: true,
  templateUrl: './music-generator.component.html',
  styleUrls: ['./music-generator.component.css'],
  imports: [
    NgIf,
    NgClass,
    NgFor,
    StructurePanelComponent,
    DurationPanelComponent,
    TempoPanelComponent,
    GearPanelComponent,
    GenrePanelComponent,
    FormsModule,
    ModalStartFreeComponent,
    NgStyle
  ]
})
export class MusicGeneratorComponent {
  // Estado de navegación entre pestañas
  activeTab: 'generator' | 'text-to-music' = 'generator';
  activeSections: string[] = ['genre'];
  textPrompt: string = '';
  showLoginModal = false;
  isMobileView = window.innerWidth <= 1000;

  // Referencias a componentes hijos y elementos DOM
  @ViewChild(GenrePanelComponent) genrePanel!: GenrePanelComponent;
  @ViewChild(DurationPanelComponent) durationPanel!: DurationPanelComponent;
  @ViewChild(EnergyPanelComponent) energyPanel!: EnergyPanelComponent;
  @ViewChild(TempoPanelComponent) tempoPanel!: TempoPanelComponent;
  @ViewChild(GearPanelComponent) gearPanel!: GearPanelComponent;
  @ViewChild('mainHeader') mainHeaderRef!: ElementRef;

  constructor(
    private songService: SongService,
    private authService: AuthService,
    private playlistService: PlaylistService,
    private cdr: ChangeDetectorRef
  ) {}

  @HostListener('window:resize')
  onResize() {
    this.isMobileView = window.innerWidth <= 1000;
  }

  setActiveTab(tab: 'generator' | 'text-to-music') {
    this.activeTab = tab;
  }

  toggleSection(section: string) {
    if (!this.activeSections.includes(section)) {
      this.activeSections.push(section);
    } else {
      this.activeSections = this.activeSections.filter(s => s !== section);
    }
  }

  isActive(section: string): boolean {
    return section === 'genre' || this.activeSections.includes(section);
  }

  // Estados de generación y reproducción de canciones
  generatedSong: any = null;
  isGenerating: boolean = false;
  isPlaying = false;
  currentTime = '0:00';
  duration = '0:00';
  durationSeconds = 0;
  currentSeconds = 0;
  isAddedToLibrary = false;

  // Generación basada en paneles visuales
  generateSong() {
    if (!this.authService.isLoggedIn()) {
      this.showLoginModal = true;
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.showLoginModal = true;
      return;
    }

    this.isGenerating = true;
    this.generatedSong = null;

    const songDTO = {
      genre: this.genrePanel.getSelectedGenre(),
      subgenre: this.genrePanel.getSelectedSubGenre(),
      duration: this.isActive('duration') ? this.durationPanel.selectedDuration : null,
      tempo: this.isActive('tempo') ? this.tempoPanel.getSelectedTempo() : null,
      instrumentNames: this.isActive('gear') ? this.gearPanel.gears.filter(g => g.quantity > 0).map(g => g.name) : [],
      promptText: '',
      userId: currentUser.id
    };

    this.songService.generateSong(songDTO).subscribe({
      next: res => {
        this.generatedSong = res;
        this.isGenerating = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          const el = document.getElementById('generating-block');
          if (this.isMobileView && el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 0);
      },
      error: err => {
        console.error('❌ Error al generar:', err);
        this.isGenerating = false;
      }
    });
  }

  // Generación desde texto libre
  generateFromTextPrompt() {
    if (!this.authService.isLoggedIn()) {
      this.showLoginModal = true;
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.showLoginModal = true;
      return;
    }

    this.isGenerating = true;
    this.generatedSong = null;

    const songDTO = {
      genre: null,
      subgenre: null,
      duration: null,
      tempo: null,
      instrumentNames: [],
      promptText: this.textPrompt,
      userId: currentUser.id
    };

    this.songService.generateSong(songDTO).subscribe({
      next: res => {
        this.generatedSong = res;
        this.isGenerating = false;
      },
      error: err => {
        console.error('❌ Error al generar desde texto:', err);
        this.isGenerating = false;
      }
    });
  }

  togglePlay(audio: HTMLAudioElement) {
    this.isPlaying = !this.isPlaying;
    this.isPlaying ? audio.play() : audio.pause();
  }

  setDuration(player: HTMLAudioElement) {
    this.durationSeconds = Math.floor(player.duration);
    this.duration = this.formatTime(player.duration);
  }

  updateProgress(player: HTMLAudioElement) {
    this.currentSeconds = Math.floor(player.currentTime);
    this.currentTime = this.formatTime(player.currentTime);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  seekTo(event: Event, player: HTMLAudioElement) {
    const input = event.target as HTMLInputElement;
    player.currentTime = parseFloat(input.value);
  }

  onCloseModal() {
    this.showLoginModal = false;
  }

  addToLibrary() {
    const user = this.authService.getCurrentUser();
    if (!user || !this.generatedSong) return;

    this.playlistService.addSong(user.id, this.generatedSong).subscribe({
      next: () => {
        console.log('🎵 Canción añadida a la biblioteca');
        this.isAddedToLibrary = true;
      },
      error: (err) => {
        console.error('❌ Error al añadir canción a biblioteca:', err);
      }
    });
  }

  protected readonly HTMLInputElement = HTMLInputElement;
}
