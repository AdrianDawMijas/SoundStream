import {Component, EventEmitter, Input, Output} from '@angular/core';

// Genre Selector Component
@Component({
  selector: 'app-genre-selector',
  standalone: true,
  template: `<div class="card p-3 bg-dark text-light">
               <h5>Genre</h5>
               <select class="form-control" (change)="selectGenre($event)">
                 <option *ngFor="let genre of genres" [value]="genre">{{ genre }}</option>
               </select>
             </div>`,
  styles: ['.card { margin-bottom: 10px; }']
})
export class GenreSelectorComponent {
  genres = ['Rock', 'Pop', 'Jazz', 'Electronic'];
  @Output() genreSelected = new EventEmitter<string>();
  selectGenre(event: any) {
    console.log('Selected Genre:', event.target.value);
  }
}

// Duration Selector Component
@Component({
  selector: 'app-duration-selector',
  standalone: true,
  template: `<div class="card p-3 bg-dark text-light">
    <h5>Duration</h5>
    <input type="range" min="10" max="300" class="form-range" (input)="updateDuration($event)">
  </div>`,
  styles: ['.card { margin-bottom: 10px; }']
})
export class DurationSelectorComponent {
  @Output() durationChanged = new EventEmitter<number>();
  updateDuration(event: any) {
    console.log('Selected Duration:', event.target.value);
  }
}

// Instrument Selector Component
@Component({
  selector: 'app-instrument-selector',
  standalone: true,
  template: `<div class="card p-3 bg-dark text-light">
    <h5>Instruments</h5>
    <p>Select your favorite instruments</p>
  </div>`,
  styles: ['.card { margin-bottom: 10px; }']
})
export class InstrumentSelectorComponent {}

// Tempo Selector Component
@Component({
  selector: 'app-tempo-selector',
  standalone: true,
  template: `<div class="card p-3 bg-dark text-light">
    <h5>Tempo</h5>
    <p>Adjust the speed of the music</p>
  </div>`,
  styles: ['.card { margin-bottom: 10px; }']
})
export class TempoSelectorComponent {}

// Energy Selector Component
@Component({
  selector: 'app-energy-selector',
  standalone: true,
  template: `<div class="card p-3 bg-dark text-light">
    <h5>Energy</h5>
    <p>Set the intensity of the track</p>
  </div>`,
  styles: ['.card { margin-bottom: 10px; }']
})
export class EnergySelectorComponent {}

// Structure Selector Component
@Component({
  selector: 'app-structure-selector',
  standalone: true,
  template: `<div class="card p-3 bg-dark text-light">
    <h5>Structure</h5>
    <p>Define the song arrangement</p>
  </div>`,
  styles: ['.card { margin-bottom: 10px; }']
})
export class StructureSelectorComponent {}

// Song Results Component
@Component({
  selector: 'app-song-results',
  standalone: true,
  template: `<div class="p-3 bg-dark text-light">
    <h4>Generated Songs</h4>
    <p>Here your AI-generated songs will appear</p>
  </div>`
})
export class SongResultsComponent {
  @Input() duration!: number;
  @Input() genre!: string;
}

// 🎯 Music Generator Component (Debe ir al final)
@Component({
  selector: 'app-music-generator',
  standalone: true,
  templateUrl: './music-generator.component.html',
  styleUrls: ['./music-generator.component.css'],
  imports: [
    GenreSelectorComponent,
    DurationSelectorComponent,
    InstrumentSelectorComponent,
    TempoSelectorComponent,
    EnergySelectorComponent,
    StructureSelectorComponent,
    SongResultsComponent
  ]
})
export class MusicGeneratorComponent {
  selectedGenre: string = '';
  selectedDuration: number = 30;
  activeComponents: string[] = [];

  onGenreSelected(genre: string) {
    this.selectedGenre = genre;
  }

  onDurationChanged(duration: number) {
    this.selectedDuration = duration;
  }

  activateComponent(component: string) {
    if (!this.activeComponents.includes(component)) {
      this.activeComponents.push(component);
    }
  }
}
