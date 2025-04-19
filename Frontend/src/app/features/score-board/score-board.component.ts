import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/AuthService/auth.service';

@Component({
    selector: 'app-score-board',
    standalone: true,
    imports: [],
    templateUrl: './score-board.component.html',
    styleUrl: './score-board.component.css'
})
export class ScoreBoardComponent{
  constructor() {}
  saveScore(score: any,) {}
 };