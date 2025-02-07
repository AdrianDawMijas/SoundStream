import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent} from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {NgOptimizedImage} from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent, NgOptimizedImage],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SoundStream';
}
