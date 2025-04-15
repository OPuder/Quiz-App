import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuizlogicService } from '../../quiz/services/quizlogic.service';

@Component({
    selector: 'app-type-script-startseite',
    imports: [CommonModule, RouterLink],
    templateUrl: './type-script-startseite.component.html',
    styleUrl: './type-script-startseite.component.css'
})
export class TypeScriptStartseiteComponent {

  constructor(private QuizlogicService: QuizlogicService) {}
  
  toggleQuiz(selectedCase: number) {
    this.QuizlogicService.toggleQuiz(selectedCase);
   }

}
