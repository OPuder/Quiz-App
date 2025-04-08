import { Injectable } from '@angular/core';
import { TranslationService } from '../../../services/translation/translation-service.service';
import { map } from 'rxjs/operators';
import { Fragen } from './../../../../app/features/quiz/models/fragen';
import { testFragen } from '../../../../assets/fragenSammlung/TestFragen';
import { jMidd } from '../../../../assets/fragenSammlung/JavaScriptMittel';
import { jEasy } from '../../../../assets/fragenSammlung/JavaScriptLeicht';
import { jHard } from '../../../../assets/fragenSammlung/JavaScriptSchwer';
import { jZufall } from '../../../../assets/fragenSammlung/JavaScriptZufall';
import { tEasy } from '../../../../assets/fragenSammlung/TypeScriptLeicht';
import { tMidd } from '../../../../assets/fragenSammlung/TypeScriptMittel';
import { tHard } from '../../../../assets/fragenSammlung/TypeScriptSchwer';
import { tZufall } from '../../../../assets/fragenSammlung/TypeScriptZufall';
import { aEasy } from '../../../../assets/fragenSammlung/AngularLeicht';
import { aMidd } from '../../../../assets/fragenSammlung/AngularMittel';
import { aHard } from '../../../../assets/fragenSammlung/AngularSchwer';
import { aZufall } from '../../../../assets/fragenSammlung/AngularZufall';

@Injectable({
  providedIn: 'root',
})
export class QuizlogicService {
  zufälligeFragen15: Fragen[] = [];
  zufallsFragen: Fragen[] = [];
  Fragen: Fragen[] = [];
  unbeantworteteFragen: Fragen[] = [];
  quizAbgeschlossen: boolean = false;
  skipRunde: boolean = false;
  selectedCase: number = 0;
  punktzahl: number = 0;
  aktuelleFrageIndex: number = 0;
  skipFragenIndex: number = 0;
  antwortIndex: number = 0;
  aktuelleAntwort: string[] = [];
  skipAntwort: string[] = [];
  aktuelleFrage: string = '';
  skipFrage: string = '';

  constructor(private translationService: TranslationService) {}

  toggleQuiz(selectedCase: number) {
    let selectedArray: Fragen[];

    switch (selectedCase) {
      case 15:
        this.translationService
          .getTranslation('qSnipped')
          .pipe(
            map((fragen: Fragen[]) => {
              selectedArray = fragen ?? [];
              const zufallsFragen = [...selectedArray];
              this.zufallsFragen = zufallsFragen;
            })
          )
          .subscribe(
            () => {},
            (error) =>
              console.error('Fehler beim Laden der Übersetzungen:', error)
          );
        break;
      case 0:
        selectedArray = testFragen;
        break;
      case 1:
        selectedArray = jEasy;
        break;
      case 2:
        selectedArray = jMidd;
        break;
      case 3:
        selectedArray = jHard;
        break;
      case 4:
        selectedArray = jZufall;
        break;
      case 5:
        selectedArray = tEasy;
        break;
      case 6:
        selectedArray = tMidd;
        break;
      case 7:
        selectedArray = tHard;
        break;
      case 8:
        selectedArray = tZufall;
        break;
      case 9:
        selectedArray = aEasy;
        break;
      case 10:
        selectedArray = aMidd;
        break;
      case 11:
        selectedArray = aHard;
        break;
      case 12:
        selectedArray = aZufall;
        break;
      default:
        throw new Error('Ungültiger Fall ausgewählt');
    }

    this.zufallsFragen.sort(() => Math.random() - 0.5);
    const zufälligeFragen15 = this.zufallsFragen.slice(0, 15);
    this.Fragen = zufälligeFragen15;
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
    try {
      if (this.Fragen.length > this.aktuelleFrageIndex) {
        this.aktuelleFrage = this.Fragen[this.aktuelleFrageIndex].frage;
        this.aktuelleAntwort = this.Fragen[this.aktuelleFrageIndex].antwort;
      }
      if (this.aktuelleFrageIndex === this.Fragen.length) {
        if (this.unbeantworteteFragen.length === this.skipFragenIndex) {
          this.quizAbgeschlossen = true;
        } else {
          this.skipRunde = true;
          this.skipFragen();
        }
      }
    } catch (error) {
      console.error('Fehler beim Laden der Fragen:', this.Fragen, error);
    }
  }

  fragenNummer(): number | string {
    try {
      const gesamtanzahlFragen = this.Fragen.length;
      const aktuelleFragennummer = this.aktuelleFrageIndex + 1;
      if (aktuelleFragennummer <= gesamtanzahlFragen) {
        return 'Frage:' + aktuelleFragennummer;
      } else {
        return 'Übersprungende Fragen';
      }
    } catch (error) {
      console.error('Ungültige aktuelle Fragennummer:');
      return -1;
    }
  }

  pruefeAntwort(antwortIndex: number) {
    try {
      this.antwortIndex = antwortIndex;
      if (this.Fragen.length > this.aktuelleFrageIndex) {
        if (
          this.Fragen[this.aktuelleFrageIndex].correctAntwort === antwortIndex
        ) {
          this.punktzahl++;
        }
        this.aktuelleFrageIndex++;
        this.ladeFrage();
      } else {
        if (
          this.unbeantworteteFragen[this.skipFragenIndex].correctAntwort ===
          antwortIndex
        ) {
          this.punktzahl++;
        }
        this.skipFragenIndex++;
        this.skipFragen();
      }
    } catch (error) {
      console.error('Fehler bei der Auswahl der Antworten', error);
    }
  }

  nextFrage() {
    try {
      if (!this.Fragen[this.aktuelleFrageIndex].uebersprungen) {
        this.Fragen[this.aktuelleFrageIndex].uebersprungen = true;
        this.unbeantworteteFragen.push(this.Fragen[this.aktuelleFrageIndex]);
      }
      if (this.aktuelleFrageIndex < this.Fragen.length) {
        this.aktuelleFrageIndex++;
        this.ladeFrage();
      }
    } catch (error) {
      console.error('Fehler beim Anzeigen der nächsten Frage:', error);
    }
  }

  skipFragen() {
    try {
      if (this.skipFragenIndex === this.unbeantworteteFragen.length) {
        this.quizAbgeschlossen = true;
      }
      if (this.unbeantworteteFragen.length > this.skipFragenIndex) {
        this.skipFrage = this.unbeantworteteFragen[this.skipFragenIndex].frage;
        this.skipAntwort =
          this.unbeantworteteFragen[this.skipFragenIndex].antwort;
        this.aktuelleFrage = this.skipFrage;
        this.aktuelleAntwort = this.skipAntwort;
        this.skipRunde = true;
      }
    } catch (error) {
      console.error('Fehler beim Anzeigen der übersprungenen Fragen:', error);
    }
  }

  neustart() {
    this.Fragen.forEach((frage: Fragen) => {
      frage.uebersprungen = false;
    });
    this.skipRunde = false;
    this.quizAbgeschlossen = false;
    this.unbeantworteteFragen = [];
    this.aktuelleFrageIndex = 0;
    this.skipFragenIndex = 0;
    this.punktzahl = 0;
    this.Fragen = this.Fragen.sort(() => Math.random() - 0.5);
    this.ladeFrage();
  }
}