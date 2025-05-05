import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-genre-panel',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.css'],
})
export class GenrePanelComponent {
  selectedGenre: string = 'Rock';
  genreList: string[] = ['Rock', 'Pop', 'Jazz', 'Electronic', 'Hip Hop'];
  selectedSubGenres: string[] = [];

  genreIcons: { [key: string]: string } = {
    Rock: 'fa-solid fa-guitar',
    Pop: 'fa-solid fa-microphone-lines',
    Jazz: 'fa-solid fa-volume-high',
    Electronic: 'fa-solid fa-music',
    'Hip Hop': 'fa-solid fa-headphones-simple'
  };

  subGenres: { [key: string]: string[] } = {
    Rock: ['Indie Rock', 'Hard Rock', 'Punk'],
    Pop: ['Dance Pop', 'Teen Pop', 'Electro Pop'],
    Jazz: ['Smooth Jazz', 'Bebop', 'Swing'],
    Electronic: ['Techno', 'House', 'Trance'],
    'Hip Hop': ['Trap', 'Boom Bap', 'Lo-Fi']
  };

  selectGenre(genre: string): void {
    this.selectedGenre = genre;
    this.selectedSubGenres = [];
  }

  toggleSubGenre(sub: string): void {
    const index = this.selectedSubGenres.indexOf(sub);
    if (index > -1) {
      this.selectedSubGenres.splice(index, 1);
    } else {
      this.selectedSubGenres.push(sub);
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  showDropdown: boolean = false;

  // ✅ Métodos públicos para el componente padre
  getSelectedGenre(): string {
    return this.selectedGenre;
  }

  getSelectedSubGenre(): string | null {
    return this.selectedSubGenres.length > 0 ? this.selectedSubGenres[0] : null;
  }
}
