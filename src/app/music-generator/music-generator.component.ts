import { Component, ViewChild } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StructurePanelComponent } from './panels/structure-panel/structure-panel.component';
import { DurationPanelComponent } from './panels/duration-panel/duration-panel.component';
import { EnergyPanelComponent } from './panels/energy-panel/energy-panel.component';
import { TempoPanelComponent } from './panels/tempo-panel/tempo-panel.component';
import { GearPanelComponent } from './panels/gear-panel/gear-panel.component';
import { GenrePanelComponent } from './panels/genre-panel/genre.component';
import { SongService } from './service/song-service.service';

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
    FormsModule
  ]
})
export class MusicGeneratorComponent {
  activeTab: 'generator' | 'text-to-music' = 'generator';
  activeSections: string[] = [];
  textPrompt: string = '';

  @ViewChild(GenrePanelComponent) genrePanel!: GenrePanelComponent;
  @ViewChild(DurationPanelComponent) durationPanel!: DurationPanelComponent;
  @ViewChild(EnergyPanelComponent) energyPanel!: EnergyPanelComponent;
  @ViewChild(TempoPanelComponent) tempoPanel!: TempoPanelComponent;
  @ViewChild(GearPanelComponent) gearPanel!: GearPanelComponent;

  constructor(private songService: SongService) {}

  setActiveTab(tab: 'generator' | 'text-to-music') {
    this.activeTab = tab;
  }

  toggleSection(section: string) {
    const index = this.activeSections.indexOf(section);
    if (index > -1) {
      this.activeSections.splice(index, 1);
    } else {
      this.activeSections.push(section);
    }
  }

  isActive(section: string): boolean {
    return this.activeSections.includes(section);
  }

  generatedSong: any = null;
  isGenerating: boolean = false;

  generateSong() {
    this.isGenerating = true;
    this.generatedSong = null;

    const songDTO = {
      genre: this.genrePanel.getSelectedGenre(),
      subgenre: this.genrePanel.getSelectedSubGenre(),
      duration: this.isActive('duration') ? this.durationPanel.selectedDuration : null,
      tempo: this.isActive('tempo') ? this.tempoPanel.getSelectedTempo() : null,
      instrumentNames: this.isActive('gear') ? this.gearPanel.gears.filter(g => g.quantity > 0).map(g => g.name) : [],
      promptText: '',
      userId: 1
    };

    this.songService.generateSong(songDTO).subscribe({
      next: res => {
        this.generatedSong = res;
        this.isGenerating = false;
      },
      error: err => {
        console.error('❌ Error al generar:', err);
        this.isGenerating = false;
      }
    });
  }

  generateFromTextPrompt() {
    this.isGenerating = true;
    this.generatedSong = null;

    const songDTO = {
      genre: null,
      subgenre: null,
      duration: null,
      tempo: null,
      instrumentNames: [],
      promptText: this.textPrompt,
      userId: 1
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

  isPlaying = false;
  currentTime = '0:00';
  duration = '0:00';
  durationSeconds = 0;
  currentSeconds = 0;

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

  seekAudio(event: MouseEvent, audio: HTMLAudioElement) {
    const container = event.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    audio.currentTime = percentage * (audio.duration || 0);
  }

  seekTo(event: Event, player: HTMLAudioElement) {
    const input = event.target as HTMLInputElement;
    player.currentTime = parseFloat(input.value);
  }

  protected readonly HTMLInputElement = HTMLInputElement;
}
