# Quiz-App

Diese Angular-basierte Quiz-App zeigt Fragen, ermöglicht Antworten, springt weiter und zeigt am Ende eine Auswertung.  
Die Hauptkomponente befindet sich unter:

```
C:\Projecte\Quiz-App\src\app\quiz\quiz-snipped
```

Unten ist der komplette Code der `quiz-snipped.component` mit allen zugehörigen Dateien dokumentiert.

## 📦 Komponenten-Code

### TypeScript (Component)
```ts
import { Component, OnInit } from '@angular/core';                                             // Import von Component und OnInit aus dem Angular-Core
import { CommonModule } from '@angular/common';                                                // Import des CommonModule aus Angular für die gemeinsame Verwendung
import { QuizlogicService } from '../../quiz/quizlogic.service';

@Component({
  selector: 'app-quiz-Snipped',                                                                // Der Selctor Name zum Aufrufen der Komponente 
  standalone: true,                                                                            // Standalone True oder False bestimmt ob sie eine Module und Routing Datei / Pfad brauch
  imports: [CommonModule,],                                                                    // Einbindung des CommonModule
  templateUrl: './quiz-snipped.component.html',                                                // Pfad zur HTML-Datei für das Template
  styleUrl: './quiz-snipped.component.css'                                                     // Pfad zur CSS-Datei für das Styling
})
export class QuizSnippedComponent implements OnInit {                                          // Implementierung des OnInit-Interfaces und Export der Komponentenklasse zum Importieren in anderen Komponenten 
  constructor(private quizlogicService: QuizlogicService) {                                    // Konstruktor der QuizComponent-Klasse, der den FragenArrayService als Abhängigkeit injiziert
  }
  // Getter-Funktion, um den aktuellen Wert von skipRunde aus dem Service abzurufen
  get skipRunde(): boolean {                                                                   // Getter-Funktion, um den aktuellen Wert von skipRunde aus dem Service abzurufen (Ruft jedesmal den Status ab wenn skipRunde im Service aufgerufen wird)
    return this.quizlogicService.skipRunde;                                                    // Return den Aktuellen Wert von skipRunde aus dem Service
  }
  ngOnInit(): void {                                                                           // Lifecycle-Funktion, die beim Laden der Komponente aufgerufen wird
    this.quizlogicService.initializeQuiz();                                                    // Initialisierung des Quiz beim Laden der Komponente
  }
  punktzahl() {                                                                                // Methode um den aktuellen Punktzahl aus dem Service abzurufen
    return this.quizlogicService.punktzahl;                                                    // Return den Aktuellen Wert von punktzahl aus dem Service
  }
  fragenNummer(): number | string {                                                            // Methode zum Abrufen der aktuellen Fragennummer
    return this.quizlogicService.fragenNummer();                                               // Return den Aktuellen Wert von fragenNummer aus dem Service
  }
  aktuelleFrage() {                                                                            // Methode zum Abrufen der aktuellen Frage
    return this.quizlogicService.aktuelleFrage;                                                // Return den Aktuellen Wert von aktuelleFrage aus dem Service
  }
  aktuelleAntwort() {                                                                          // Methode zum Abrufen der aktuellen Antwort der aktuellen Frage
    return this.quizlogicService.aktuelleAntwort;                                              // Return den Aktuellen Wert von aktuelleAntwort aus dem Service
  }
  pruefeAntwort(i: number) {                                                                   // Methode zum Prüfen der Antwort 
    this.quizlogicService.pruefeAntwort(i);                                                    // Aufruf der Methode pruefeAntwort aus dem Service
  }
  nextFrage() {                                                                                // Methode zum Wechseln zur nächsten Frage
    this.quizlogicService.nextFrage();                                                         // Aufruf der Methode nextFrage aus dem Service
  }
  neustart() {                                                                                 // Methode zum Neustarten des Quizzes
    this.quizlogicService.neustart();                                                          // Aufruf der Methode neustart aus dem Service
  }
  ladeFrage() {                                                                                // Methode zum Laden der naechsten Frage
    return this.quizlogicService.ladeFrage();                                                  // Aufruf der Methode ladeFrage aus dem Service
  }
  quizAbgeschlossen() {                                                                        // Methode zum Abrufen ob das Quiz abgeschlossen ist
    return this.quizlogicService.quizAbgeschlossen;                                            // Aufruf der Methode quizAbgeschlossen aus dem Service
  }
}
```
### HTML (Template)
```html
<!-- Einbindung von Bootstrap -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
<!-- Container mit flexibler Ausrichtung -->
<div class="container">
  <div class="relative-element">
  <!-- Quiz-Container *ngIf="!quizAbgeschlossen"-->
  <div  id="quiz-container" *ngIf="!quizAbgeschlossen()" class="card">
    <div class="card-header">
      <!-- Anzeige der Frage-Nummer -->
      <div id="Fragennummer"><h2>{{ fragenNummer() }}</h2></div>
      <!-- Anzeige der aktuellen Frage -->
      <div id="Frage"><p>{{ aktuelleFrage() }}</p></div>
    </div>
    <!-- Auswahlmöglichkeiten für die Frage -->
    <div class="card-body" >
      <div id="antwort" *ngFor="let antwort of (aktuelleAntwort()); let i = index">
        <!-- Button für jede Antwortmöglichkeit -->
        <button class="btn btn-outline-secondary me-auto col-6 border border-white" (click)="pruefeAntwort(i)">{{ antwort }}</button>
      </div>
    </div>
    <!-- Button für das Überspringen zur nächsten Frage -->
    <div class="card-footer">
      <button id="skipFrage" class="btn btn-warning" (click)="nextFrage()" [disabled]="skipRunde">Nächste Frage</button>
    </div>
  </div>
</div>  <!-- Ergebnis-Anzeige -->
<div id="result" class="card" *ngIf="quizAbgeschlossen()">
  <div class="card-header">

    <!-- Überschrift für das Ergebnis -->
    <h1>Geschafft!!!</h1>
    <h2>Danke fürs Teilnehmen</h2>
  </div>

  <!-- Anzeige der Punktzahl -->
  <div class="card-body">
    <p>Du hast {{ punktzahl() }} von 4 Fragen richtig beantwortet.</p>
  </div>

  <!-- Button zum Neustarten des Quiz -->
  <div class="card-footer">
    <button id="neustart" class="btn btn-outline-dark" (click)="neustart()">RESTART</button>
  </div>
</div>
</div>

```
### CSS (Styles)
```css
/* Allgemeine Styles für den Quiz-Container */
.container {
    display: flex;                  /* Flexbox-Layout verwenden */
    justify-content: flex-start;    /* Elemente links ausrichten */
    align-items: center;            /* Zentrierte vertikale Ausrichtung */
    padding: 1px;                   /* Abstand um den Container herum */
    margin-right: 20px;
    flex: 0 0 200px;                /* Flex-Eigenschaften: Kein Wachstum, Schrumpfen erlauben, automatische Basisbreite */
  }
  
  .card-header {
      text-align: center;           /* Zentrierte Textausrichtung */
      padding: 1.5rem;              /* Innenabstand */
      background-color: #f8f9fa;  /* Hintergrundfarbe */
    }
  .card-body {
      text-align: center;           /* Zentrierte Textausrichtung */
    }
  .card-footer {
      text-align: end;              /* Zentrierte Textausrichtung */
      padding: 1.5rem;              /* Innenabstand */
      background-color: #f8f9fa;  /* Hintergrundfarbe */
    }
  .relative-element {
      position: relative;             /* Positionierung relativ zum normalen Fluss */
      left: -20px;                   /* Verschieben Sie das Element um 20 Pixel nach links */
    }
  
```
### TypeScript (Test)
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizSnippedComponent } from './quiz-snipped.component';

describe('QuizSnippedComponent', () => {
  let component: QuizSnippedComponent;
  let fixture: ComponentFixture<QuizSnippedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizSnippedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizSnippedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

```


## 📝 Lizenz

MIT License

**Autor:** [OPuder](https://github.com/OPuder)
