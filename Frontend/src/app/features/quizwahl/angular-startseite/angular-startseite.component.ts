import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuizlogicService } from '../../quiz/services/quizlogic.service';

@Component({
    selector: 'app-angular-startseite',
    imports: [CommonModule, RouterLink],
    templateUrl: './angular-startseite.component.html',
    styleUrl: './angular-startseite.component.css'
})
export class AngularStartseiteComponent {

  constructor(private QuizlogicService: QuizlogicService) {}
  toggleQuiz(selectedCase: number) {
    this.QuizlogicService.toggleQuiz(selectedCase);
   }
}
