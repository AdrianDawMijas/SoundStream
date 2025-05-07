import { Component, OnInit } from '@angular/core';
import { PlaylistService } from '../service/playlist.service';
import { AuthService } from '../service/auth.service';
import { Song } from '../model/Song';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SongWithState extends Song {
  playing: boolean;
}

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  imports: [NgClass, NgForOf, NgIf, FormsModule],
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  songs: SongWithState[] = [];
  filteredSongs: SongWithState[] = [];

  // Estado general
  currentUserId = 0;
  isAdmin = false;
  currentAudio: HTMLAudioElement | null = null;
  currentSong: SongWithState | null = null;

  // Filtros
  filterTitle = '';
  selectedDuration = 180;
  selectedGenre = '';
  selectedInstrument = '';
  selectedTempo = '';

  // Opciones dinámicas
  genreOptions: string[] = [];
  instrumentOptions: string[] = [];
  tempoOptions: string[] = [];

  // Paginación
  currentPage = 1;
  pageSize = 5;

  constructor(private playlistService: PlaylistService, private authService: AuthService) {}

  ngOnInit(): void {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUserId = storedUser.id;
    this.isAdmin = storedUser.email === 'admin@admin.com';

    this.isAdmin ? this.fetchAllSongs() : this.fetchUserLibrary();
  }

  fetchUserLibrary(): void {
    this.playlistService.getUserLibrary(this.currentUserId).subscribe({
      next: (playlist) => {
        this.songs = (playlist.songs || []).map(song => ({ ...song, playing: false }));
        this.filteredSongs = [...this.songs];
        this.extractFilterOptions();
      },
      error: () => {
        console.warn('No playlist found, creating one...');
        this.playlistService.createUserLibrary(this.currentUserId).subscribe();
      }
    });
  }

  fetchAllSongs(): void {
    fetch('http://localhost:8080/v1/api/songs')
      .then(res => res.json())
      .then((allSongs: Song[]) => {
        this.songs = allSongs.map(song => ({ ...song, playing: false }));
        this.filteredSongs = [...this.songs];
        this.extractFilterOptions();
      });
  }

  togglePlay(song: SongWithState): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
      this.songs.forEach(s => s.playing = false);
      if (this.currentSong?.id === song.id) {
        this.currentSong = null;
        return;
      }
    }

    this.currentAudio = new Audio(song.generatedUrl);
    this.currentAudio.play();
    song.playing = true;
    this.currentSong = song;

    this.currentAudio.onended = () => {
      song.playing = false;
      this.currentAudio = null;
      this.currentSong = null;
    };
  }

  parseDuration(duration: any): number {
    if (typeof duration === 'number') return duration;
    const str = String(duration);
    const parts = str.split(':');
    return parts.length === 2
      ? parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
      : parseInt(str, 10);
  }

  applyFilters(): void {
    this.filteredSongs = this.songs.filter(song => {
      const titleMatch = song.title?.toLowerCase().includes(this.filterTitle.toLowerCase()) ?? false;
      const durationMatch = this.parseDuration(song.duration) <= this.selectedDuration;
      const genreMatch = !this.selectedGenre || song.genre?.name === this.selectedGenre;
      const instrumentMatch = !this.selectedInstrument ||
        (song.instruments || []).some(inst => inst.name === this.selectedInstrument);
      const tempoMatch = !this.selectedTempo || song.tempo?.toString() === this.selectedTempo;

      return titleMatch && durationMatch && genreMatch && instrumentMatch && tempoMatch;
    });

    this.currentPage = 1;
  }

  resetFilters(): void {
    this.filterTitle = '';
    this.selectedDuration = 180;
    this.selectedGenre = '';
    this.selectedInstrument = '';
    this.selectedTempo = '';
    this.filteredSongs = [...this.songs];  // 🔥 Restaura todo
    this.currentPage = 1;
  }

  extractFilterOptions(): void {
    this.genreOptions = [...new Set(
      this.songs.map(s => s.genre?.name).filter((g): g is string => !!g)
    )];

    this.instrumentOptions = [...new Set(
      this.songs.flatMap(s => s.instruments?.map(i => i.name) || [])
    )];

    this.tempoOptions = [...new Set(
      this.songs.map(s => s.tempo?.toString()).filter((t): t is string => !!t)
    )];
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSongs.length / this.pageSize);
  }

  get paginatedSongs(): SongWithState[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredSongs.slice(start, start + this.pageSize);
  }

  trackBySong(index: number, song: Song): number {
    return song.id || index;
  }

  formatDuration(seconds: number | string): string {
    const total = Number(seconds);
    const mins = Math.floor(total / 60).toString().padStart(2, '0');
    const secs = Math.floor(total % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }
}
