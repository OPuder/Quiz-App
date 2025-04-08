import { RouterLink, RouterModule } from '@angular/router';
import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslationService } from './services/translation/translation-service.service';
import { AuthService } from './services/auth/AuthService/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'get started';
  authService = inject(AuthService);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translationService: TranslationService,
    private http: HttpClient
  ) {}

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

  logout() {
    this.authService.logout();
  }
}