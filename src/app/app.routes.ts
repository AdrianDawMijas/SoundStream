import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component'; // Vista Landing
import { LoginComponent } from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {PricingComponent} from './pricing/pricing.component';
import {MusicGeneratorComponent} from './music-generator/music-generator.component';
import {LibraryComponent} from './library/library.component';
import {ProfileComponent} from './profile/profile.component';

export const routes: Routes = [
  { path: '', component: LandingComponent }, // Ruta raíz (Landing)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'music-generator', component: MusicGeneratorComponent},
  { path: 'library', component: LibraryComponent},
  { path: 'profile', component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
