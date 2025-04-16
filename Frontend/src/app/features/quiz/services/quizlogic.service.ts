import { Injectable } from '@angular/core';
import { TranslationService } from '../../../services/translation/translation-service.service';
import { map } from 'rxjs/operators';
import { Fragen } from './../../../../app/features/quiz/models/fragen';
import { jEasy, jMidd, jHard,
  tEasy, tMidd, tHard,
  aEasy, aMidd, aHard, qSnipped
} from '../../../shared/data/fragenSammlung';

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
  aktuelleFrageIndex = 0;
  skipFragenIndex = 0;
  antwortIndex = 0;
  quizAbgeschlossen = false;
  skipRunde = false;

  constructor(private translationService: TranslationService) {}

toggleQuiz(selectedCase: number) {
    let fragenSet: Fragen[] = [];

    if (selectedCase === 15) {
      this.translationService.getTranslation('qSnipped',)
        .pipe(map((fragen: Fragen[]) => fragen ?? []))
        .subscribe({
          next: (fragen) => {
            this.zufallsFragen = [...fragen];
            this.prepareQuiz();
          },
          error: (err) => console.error('Fehler beim Laden der Übersetzungen:', err)
        });
      return;
    }

    fragenSet = this.getFragenSetByCase(selectedCase);
    this.zufallsFragen = [...fragenSet];
    this.prepareQuiz();
  }

  private getFragenSetByCase(selectedCase: number): Fragen[] {
    switch (selectedCase) {
      case 0: return qSnipped;
      case 1: return jEasy;
      case 2: return jMidd;
      case 3: return jHard;
      case 4:  {
        const easy = [...jEasy].sort(() => Math.random() - 0.5).slice(0, 5);
        const midd = [...jMidd].sort(() => Math.random() - 0.5).slice(0, 5);
        const hard = [...jHard].sort(() => Math.random() - 0.5).slice(0, 5);
        return [...easy, ...midd, ...hard].sort(() => Math.random() - 0.5);
      };
      case 5: return tEasy;
      case 6: return tMidd;
      case 7: return tHard;
      case 8: {
        const easy = [...tEasy].sort(() => Math.random() - 0.5).slice(0, 5);
        const midd = [...tMidd].sort(() => Math.random() - 0.5).slice(0, 5);
        const hard = [...tHard].sort(() => Math.random() - 0.5).slice(0, 5);
        return [...easy, ...midd, ...hard].sort(() => Math.random() - 0.5);
      };
      case 9: return aEasy;
      case 10: return aMidd;
      case 11: return aHard;
      case 12: {
        const easy = [...aEasy].sort(() => Math.random() - 0.5).slice(0, 5);
        const midd = [...aMidd].sort(() => Math.random() - 0.5).slice(0, 5);
        const hard = [...aHard].sort(() => Math.random() - 0.5).slice(0, 5);
        return [...easy, ...midd, ...hard].sort(() => Math.random() - 0.5);
      };
      default: throw new Error('Ungültiger Fall ausgewählt');
    }
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

    if (frage.correctAntwort === index) this.punktzahl++;

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
    this.punktzahl = 0;
    this.fragen = [...this.fragen].sort(() => Math.random() - 0.5);
    this.ladeFrage();
  }
}
