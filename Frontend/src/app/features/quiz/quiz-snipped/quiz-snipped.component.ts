import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizlogicService } from '../../../features/quiz/services/quizlogic.service';
import { AuthService } from '../../../services/auth/AuthService/auth.service';
import { UserManagementService } from '../../../services/admin/user-management.service';

@Component({
    selector: 'app-quiz-Snipped',
    imports: [CommonModule],
    templateUrl: './quiz-snipped.component.html',
    styleUrl: './quiz-snipped.component.css'
})

export class QuizSnippedComponent implements OnInit {

  constructor(
    private userManagementService: UserManagementService,
    public quizlogicService: QuizlogicService,
    public authService: AuthService,
  ) {}

  get skipRunde(): boolean {
    return this.quizlogicService.skipRunde;
  }

  ngOnInit(): void {
    this.quizlogicService.initializeQuiz();
  }

  get aktiveFrage() {
    return this.quizlogicService.skipRunde
      ? this.quizlogicService.unbeantworteteFragen[this.quizlogicService.skipFragenIndex]
      : this.quizlogicService.fragen[this.quizlogicService.aktuelleFrageIndex];
  }

  fragenAnzahl() {
    return this.quizlogicService.fragenAnzahl;
  }

  gesamtFragenAnzahl(): number {
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
