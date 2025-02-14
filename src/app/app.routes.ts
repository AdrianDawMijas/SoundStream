import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component'; // Vista Landing
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: LandingComponent }, // Ruta raíz (Landing)
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
