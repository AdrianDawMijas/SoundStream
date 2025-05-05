import { Component } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-structure-panel',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './structure-panel.component.html',
  styleUrls: ['./structure-panel.component.css']
})
export class StructurePanelComponent {
  structures = [
    {
      name: 'Intro - Build - Drop - Outro',
      pattern: [3, 4, 5, 6, 8, 10, 12, 14, 14, 12, 10, 6, 4, 3]
    },
    {
      name: 'Soft Start - Peak - Soft End',
      pattern: [2, 2, 3, 4, 6, 8, 9, 8, 6, 4, 3, 2]
    },
    {
      name: 'Looped Groove',
      pattern: [6, 6, 7, 6, 6, 7, 6, 6]
    },
    {
      name: 'Verse - Chorus - Verse - Chorus - Outro',
      pattern: [4, 6, 8, 10, 8, 6, 4, 2]
    }
  ];


  selectedStructure = this.structures[0];

  selectStructure(structure: any) {
    this.selectedStructure = structure;
  }
}
