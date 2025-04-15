import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizlogicService } from '../../../features/quiz/services/quizlogic.service';

@Component({
    selector: 'app-quiz-Snipped',
    imports: [CommonModule],
    templateUrl: './quiz-snipped.component.html',
    styleUrl: './quiz-snipped.component.css'
})
export class QuizSnippedComponent implements OnInit {
  constructor(private quizlogicService: QuizlogicService) {}

  get skipRunde(): boolean {
    return this.quizlogicService.skipRunde;
  }

  ngOnInit(): void {
    this.quizlogicService.initializeQuiz();
  }

  punktzahl() {
    return this.quizlogicService.punktzahl;
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
