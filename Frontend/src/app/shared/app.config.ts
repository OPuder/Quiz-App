import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from '../app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { authInterceptor } from '../services/auth/AuthService/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(), 
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    // provideAnimationsAsync(),
    provideAnimations(),
    ReactiveFormsModule,
    MatNativeDateModule,
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
  ]
};