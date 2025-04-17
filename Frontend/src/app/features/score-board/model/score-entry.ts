export interface ScoreEntry {
  userId: string;
  quizName: string;
  anzahlDerFragen: number;
  richtigeAntworten: number;
  punkte: number;
  max: number;
  datum: Date;

  falscheFragen?: {
    frage: string;
    ausgewaehlt: string;
    korrekt: string;
  }[];
  
  versuche?: number;
  dauerInSekunden?: number;
  sprache?: string;
  deviceInfo?: string;
  feedback?: string;
  bewertung?: number;
}