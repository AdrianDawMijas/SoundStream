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
  styleUrls: ['./library.component.css'],
  standalone: true,
  imports: [NgClass, NgForOf, NgIf, FormsModule]
})
export class LibraryComponent implements OnInit {

  songs: SongWithState[] = [];
  filteredSongs: SongWithState[] = [];

  currentUserId = 0;
  isAdmin = false;

  currentAudio: HTMLAudioElement | null = null;
  currentSong: SongWithState | null = null;

  filterTitle = '';
  selectedDuration = 180;
  selectedGenre = '';
  selectedInstrument = '';
  selectedTempo = '';

  genreOptions: string[] = [];
  // instrumentOptions: string[] = [];
  tempoOptions: string[] = [];

  currentPage = 1;
  pageSize = 5;

  constructor(
    private playlistService: PlaylistService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUserId = user?.id ?? 0;
    this.isAdmin = user?.role === 'ADMIN';

    this.isAdmin ? this.fetchAllSongs() : this.fetchUserSongs();
  }

  fetchUserSongs(): void {
    this.playlistService.getSongsByUser(this.currentUserId).subscribe({
      next: (songs) => {
        this.songs = songs.map(s => ({
          ...s,
          playing: false,
          genre: typeof s.genre === 'string' ? { name: s.genre } : s.genre
        }));
        this.filteredSongs = [...this.songs];
        this.extractFilterOptions();
      },
      error: (err) => console.error('Error al cargar canciones del usuario:', err)
    });
  }

  fetchAllSongs(): void {
    this.playlistService.getAllSongs().subscribe({
      next: (songs) => {
        this.songs = songs.map(s => ({
          ...s,
          playing: false,
          genre: typeof s.genre === 'string' ? { name: s.genre } : s.genre
        }));
        this.filteredSongs = [...this.songs];
        this.extractFilterOptions();
      },
      error: (err) => console.error('Error al cargar todas las canciones:', err)
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
      const titleMatch = !this.filterTitle || song.title?.toLowerCase().includes(this.filterTitle.toLowerCase());

      const durationMatch = this.parseDuration(song.duration) <= this.selectedDuration;

      const genreMatch =
        this.selectedGenre ? song.genre?.name === this.selectedGenre : true;


      const tempoMatch =
        this.selectedTempo ? song.tempo?.toString() === this.selectedTempo : true;

      return titleMatch && durationMatch && genreMatch && tempoMatch;
    });

    this.currentPage = 1;
  }




  resetFilters(): void {
    this.filterTitle = '';
    this.selectedDuration = 90;
    this.selectedGenre = '';
    // this.selectedInstrument = '';
    this.selectedTempo = '';
    this.filteredSongs = [...this.songs];
    this.currentPage = 1;
  }

  extractFilterOptions(): void {
    const normalize = (v: string | undefined | null) =>
      (v ?? '').trim().replace(/^['"]+|['"]+$/g, '');

    this.genreOptions = [...new Set(
      this.songs.map(s => normalize(s.genre?.name)).filter(Boolean)
    )];


    this.tempoOptions = [...new Set(
      this.songs.map(s => normalize(String(s.tempo))).filter(Boolean)
    )];
  }

  deleteSong(songId: number): void {
    this.playlistService.removeSong(songId).subscribe({
      next: () => {
        if (this.currentSong?.id === songId) {
          this.currentAudio?.pause();
          this.currentAudio = null;
          this.currentSong = null;
        }

        this.songs = this.songs.filter(s => s.id !== songId);
        this.applyFilters();
      },
      error: err => console.error('Error al eliminar canción:', err)
    });
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
