import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicGeneratorComponent } from './music-generator.component';

describe('MusicGeneratorComponent', () => {
  let component: MusicGeneratorComponent;
  let fixture: ComponentFixture<MusicGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusicGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
