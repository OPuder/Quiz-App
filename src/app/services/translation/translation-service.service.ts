import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fragen } from '../../features/quiz/models/fragen';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  translations: any = {};
  currentLanguage: string = '';

  constructor(private http: HttpClient) {
    this.loadTranslations().subscribe((data: any) => {
      this.translations = data;
    });
  }

  loadTranslations(): Observable<any> {
    return this.http.get('assets/translations.json');
  }

  setLanguage(language: string) {
    const availableLanguages = Object.keys(this.translations);
  
    if (availableLanguages.includes(language)) {
      this.currentLanguage = language;
      return;
    }
  
    const baseLang = language.split('-')[0];
    const match = availableLanguages.find((l) => l.startsWith(baseLang));
    if (match) {
      console.warn(`Sprache '${language}' nicht gefunden, fallback auf '${match}'`);
      this.currentLanguage = match;
      return;
    }
  
    console.warn(`Sprache '${language}' nicht verfügbar, fallback auf 'de-DE'`);
    this.currentLanguage = 'de-DE';
  }

  getTranslation(key: string): Observable<Fragen[]> {
    return new Observable<Fragen[]>((observer) => {
      if (!this.translations) {
        console.error("Translation ?!? Nothing Find yet -.-'");
        return;
      }

      const langBlock = this.translations[this.currentLanguage];
      if (!langBlock) {
        console.warn(
          `Keine Übersetzung für Sprache '${this.currentLanguage}' gefunden.`
        );
        observer.error(
          `Keine Übersetzung für Sprache '${this.currentLanguage}' gefunden.`
        );
        return;
      }

      const translation = langBlock[key];
      if (!translation) {
        console.warn(
          `Übersetzung für Schlüssel '${key}' in Sprache '${this.currentLanguage}' nicht gefunden.`
        );
        observer.error(
          `Übersetzung für Schlüssel '${key}' in Sprache '${this.currentLanguage}' nicht gefunden.`
        );
        return;
      }

      observer.next(translation);
      observer.complete();
    });
  }
}
