import { Injectable } from '@angular/core';
import { TranslationService } from '../../../services/translation/translation-service.service';
import { map } from 'rxjs/operators';
import { Fragen } from './../../../../app/features/quiz/models/fragen';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../services/auth/AuthService/auth.service';

@Injectable({
  providedIn: 'root',
})
export class QuizlogicService {
  fragen: Fragen[] = [];
  zufallsFragen: Fragen[] = [];
  unbeantworteteFragen: Fragen[] = [];
  aktuelleAntwort: string[] = [];
  aktuelleFrage: string = '';
  skipAntwort: string[] = [];
  skipFrage: string = '';

  punktzahl = 0;
  fragenAnzahl = 0;
  aktuelleFrageIndex = 0;
  skipFragenIndex = 0;
  antwortIndex = 0;
  quizAbgeschlossen = false;
  skipRunde = false;

  constructor(
    private translationService: TranslationService,
    private authService: AuthService,
  ) {}

  toggleQuiz(selectedCase: number) {
    const keyMap: { [key: number]: string } = {
      0: 'qSnipped',
      1: 'topicJ.easy', 2: 'topicJ.medium', 3: 'topicJ.hard',
      5: 'topicT.easy', 6: 'topicT.medium', 7: 'topicT.hard',
      9: 'topicA.easy', 10: 'topicA.medium', 11: 'topicA.hard'
    };

    const mixMap: { [key: number]: string } = {
      4: 'topicJ', 8: 'topicT', 12: 'topicA'
    };

    const topic = mixMap[selectedCase];
    if (topic) {
      forkJoin({
        easy: this.translationService.getTranslation(`${topic}.easy`).pipe(map((f: Fragen[]) => f ?? [])),
        medium: this.translationService.getTranslation(`${topic}.medium`).pipe(map((f: Fragen[]) => f ?? [])),
        hard: this.translationService.getTranslation(`${topic}.hard`).pipe(map((f: Fragen[]) => f ?? []))
      }).subscribe({
        next: ({ easy, medium, hard }) => {
          const mix = [
            ...this.pickRandom(easy, 5),
            ...this.pickRandom(medium, 5),
            ...this.pickRandom(hard, 5)
          ].sort(() => Math.random() - 0.5);
          this.zufallsFragen = mix;
          this.prepareQuiz();
        },
        error: err => console.error('Fehler beim Laden gemischter Fragen:', err)
      });
    } else {
      const key = keyMap[selectedCase];
      if (!key) return console.error('Ungültiger Fall:', selectedCase);
      this.translationService.getTranslation(key)
        .pipe(map((fragen: Fragen[]) => fragen ?? []))
        .subscribe({
          next: (fragen) => {
            this.zufallsFragen = [...fragen];
            this.prepareQuiz();
          },
          error: (err) => console.error(`Fehler beim Laden der Fragen für ${key}:`, err)
        });
    }
  }

  private pickRandom(array: Fragen[], count: number): Fragen[] {
    return [...array].sort(() => Math.random() - 0.5).slice(0, count);
  }

  private prepareQuiz() {
    this.zufallsFragen.sort(() => Math.random() - 0.5);
    this.fragen = this.zufallsFragen.slice(0, 15);
    this.initializeQuiz();
  }

  initializeQuiz() {
    this.aktuelleFrageIndex = 0;
    this.skipFragenIndex = 0;
    this.punktzahl = 0;
    this.fragenAnzahl = 0;
    this.quizAbgeschlossen = false;
    this.skipRunde = false;
    this.unbeantworteteFragen = [];
    this.ladeFrage();
  }

  ladeFrage() {
    if (this.fragen.length > this.aktuelleFrageIndex) {
      const frage = this.fragen[this.aktuelleFrageIndex];
      this.aktuelleFrage = frage.frage;
      this.aktuelleAntwort = frage.antwort;
    } else if (this.aktuelleFrageIndex === this.fragen.length) {
      this.skipRunde = true;
      this.skipFragenIndex < this.unbeantworteteFragen.length
        ? this.skipFragen()
        : this.quizAbgeschlossen = true;
    }
  }

  pruefeAntwort(index: number) {
    this.antwortIndex = index;
    const istSkip = this.skipRunde;
    const frage = istSkip
      ? this.unbeantworteteFragen[this.skipFragenIndex]
      : this.fragen[this.aktuelleFrageIndex];

    if (frage.correctAntwort === index) this.fragenAnzahl++;
    if (frage.correctAntwort === index && this.authService.isLoggedIn()) {
      this.punktzahl += frage.points ?? 0;
    }

    istSkip ? this.skipFragenIndex++ : this.aktuelleFrageIndex++;
    istSkip ? this.skipFragen() : this.ladeFrage();
  }

  nextFrage() {
    const frage = this.fragen[this.aktuelleFrageIndex];
    if (!frage.uebersprungen) {
      frage.uebersprungen = true;
      this.unbeantworteteFragen.push(frage);
    }
    this.aktuelleFrageIndex++;
    this.ladeFrage();
  }

  skipFragen() {
    if (this.skipFragenIndex >= this.unbeantworteteFragen.length) {
      this.quizAbgeschlossen = true;
      return;
    }
    const frage = this.unbeantworteteFragen[this.skipFragenIndex];
    this.skipFrage = frage.frage;
    this.skipAntwort = frage.antwort;
    this.aktuelleFrage = this.skipFrage;
    this.aktuelleAntwort = this.skipAntwort;
  }

  fragenNummer(): number | string {
    const num = this.aktuelleFrageIndex + 1;
    return num <= this.fragen.length ? `Frage:${num}` : 'Übersprungene Fragen';
  }

  neustart() {
    this.fragen.forEach(f => f.uebersprungen = false);
    this.skipRunde = false;
    this.quizAbgeschlossen = false;
    this.unbeantworteteFragen = [];
    this.aktuelleFrageIndex = 0;
    this.skipFragenIndex = 0;
    this.fragenAnzahl = 0;
    this.punktzahl = 0;
    
    this.fragen = [...this.fragen].sort(() => Math.random() - 0.5);
    this.ladeFrage();
  }
}
