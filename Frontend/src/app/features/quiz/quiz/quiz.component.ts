import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizlogicService } from '../../../features/quiz/services/quizlogic.service';
import { AuthService } from '../../../services/auth/AuthService/auth.service';

@Component({
    selector: 'app-quiz',
    imports: [CommonModule],
    templateUrl: './quiz.component.html',
    styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {
  constructor(
    public quizlogicService: QuizlogicService,
    public authService: AuthService
  ) {}

  get skipRunde(): boolean {
    return this.quizlogicService.skipRunde;
  }

  get aktiveFrage() {
    return this.quizlogicService.skipRunde
      ? this.quizlogicService.unbeantworteteFragen[this.quizlogicService.skipFragenIndex]
      : this.quizlogicService.fragen[this.quizlogicService.aktuelleFrageIndex];
  }

  ngOnInit(): void {
    this.quizlogicService.initializeQuiz();
  }

  fragenAnzahl() {
    return this.quizlogicService.fragenAnzahl;
  }

  gesamtFragenAnzahl() {
    return this.quizlogicService.fragen.length;
  }
  
  punktzahl() {
    return this.quizlogicService.punktzahl;
  }

  maxPunktzahl(): number {
    return this.quizlogicService.maxPunktzahl();
  }

  fragenNummer(): number | string {
    return this.quizlogicService.fragenNummer();
  }

  aktuelleFrage() {
    return this.quizlogicService.aktuelleFrage;
  }

  aktuelleAntwort() {
    return this.quizlogicService.aktuelleAntwort;
  }

  pruefeAntwort(i: number) {
    this.quizlogicService.pruefeAntwort(i);
  }

  nextFrage() {
    this.quizlogicService.nextFrage();
  }

  neustart() {
    this.quizlogicService.neustart();
  }

  ladeFrage() {
    return this.quizlogicService.ladeFrage();
  }

  quizAbgeschlossen() {
    return this.quizlogicService.quizAbgeschlossen;
  }
}
