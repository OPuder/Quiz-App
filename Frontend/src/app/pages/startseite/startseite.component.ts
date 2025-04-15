import { QuizlogicService } from '../../features/quiz/services/quizlogic.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { QuizSnippedComponent } from '../../features/quiz/quiz-snipped/quiz-snipped.component';

@Component({
    selector: 'app-startseite',
    templateUrl: './startseite.component.html',
    styleUrl: './startseite.component.css',
    imports: [CommonModule, QuizSnippedComponent]
})
export class StartseiteComponent {
  title = 'get started';
  startSeite: boolean = true;
  showQuiz: boolean = false;

  constructor(private QuizlogicService: QuizlogicService) {}

  toggleQuiz(event: Event, selectedCase: number) {
    event.preventDefault();
    this.showQuiz = !this.showQuiz;
    this.QuizlogicService.toggleQuiz(selectedCase);
  }
}
