import { provideHttpClient, withFetch, withInterceptors  } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from '../app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { authInterceptor } from '../services/auth/AuthService/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(), 
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ), provideAnimationsAsync()
  ]
};
