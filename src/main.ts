import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { AuthInterceptor } from './app/service/auth.interceptor'; // 👈 Asegúrate de importar tu interceptor

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor])), // ✅ aquí va el interceptor
    provideRouter(routes),
    importProvidersFrom(SocialLoginModule),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('TU_GOOGLE_CLIENT_ID')
          }
        ]
      } as SocialAuthServiceConfig
    }
  ]
});
