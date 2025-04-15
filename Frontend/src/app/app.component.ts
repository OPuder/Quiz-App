import { RouterLink, RouterModule } from '@angular/router';
import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslationService } from './services/translation/translation-service.service';
import { AuthService } from './services/auth/AuthService/auth.service';
import { Router } from '@angular/router';
import { UserManagementService } from './services/admin/user-management.service'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, 
// TODO: `HttpClientModule` should not be imported into a component directly.
// Please refactor the code to add `provideHttpClient()` call to the provider list in the
// application bootstrap logic and remove the `HttpClientModule` import from this component.
HttpClientModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'get started';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translationService: TranslationService,
    public authService: AuthService,
    public userManagementService: UserManagementService,
    private http: HttpClient,
    private router: Router
  ) {
    this.userManagementService.loadUserFromToken();
  }

  sprache: string = '';

  ngOnInit(): void {
    this.setDocumentLanguage();
  }

  setDocumentLanguage(): void {
    const isBrowser = isPlatformBrowser(this.platformId);

    if (isBrowser) {
      var userLanguage =
        navigator.language || (navigator as any).userLanguage || 'de-DE';
      document.documentElement.lang = userLanguage;
      this.sprache = userLanguage;
      this.translationService.setLanguage(this.sprache);
    }
  }
}