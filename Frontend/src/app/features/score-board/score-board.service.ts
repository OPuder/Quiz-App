import { Injectable } from '@angular/core';
import { ScoreEntry } from './model/score-entry';

const SCORE_KEY = 'quizAppScore';

@Injectable({
  providedIn: 'root',
})
export class ScoreBoardService {
  
  saveScore(entry: ScoreEntry) {
    const scores = this.getScores();
    scores.push(entry);
    localStorage.setItem(SCORE_KEY, JSON.stringify(scores));
  }

  getScores(): ScoreEntry[] {
    const data = localStorage.getItem(SCORE_KEY);
    return data ? JSON.parse(data) : [];
  }

  clearScores() {
    localStorage.removeItem(SCORE_KEY);
  }
}