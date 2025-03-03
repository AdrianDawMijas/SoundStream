import { Component } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-music-generator',
  standalone: true,
  templateUrl: './music-generator.component.html',
  styleUrls: ['./music-generator.component.css'],
  imports: [
    NgIf
  ]
})
export class MusicGeneratorComponent {
  activeTab: 'generator' | 'text-to-music' = 'generator';

  setActiveTab(tab: 'generator' | 'text-to-music') {
    this.activeTab = tab;
  }
}
