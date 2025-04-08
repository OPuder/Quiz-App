# Quiz-App

Eine einfache, modulare **Quiz-App** mit Angular – zur Übung, für Lernplattformen oder als Mini-Spiel.  
Dieses Projekt wurde im Rahmen einer Umschulung entwickelt.

## ✨ Features

- Fragen mit mehreren Antwortmöglichkeiten
- Fortschrittsanzeige (Fragenummer)
- Punktestand am Ende des Quiz
- Möglichkeit zum Überspringen von Fragen
- Neustart-Funktion
- Saubere UI mit Bootstrap

## 🚀 Installation

```bash
# Projekt klonen
git clone https://github.com/OPuder/Quiz-App.git
cd Quiz-App

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
ng serve
```

App läuft dann auf `http://localhost:4200`.

---

## 🧩 Quiz-Komponente

Die zentrale Darstellung des Quiz findet in der `quiz-snipped.component` statt. Hier wird gesteuert, wie Fragen angezeigt, beantwortet und übersprungen werden können. Bei Quizende wird die Punktzahl präsentiert.

### 💡 Beispiel-Layout (HTML-Auszug)

```html
<div class="card-header">
  <div><h2>{{ fragenNummer() }}</h2></div>
  <div><p>{{ aktuelleFrage() }}</p></div>
</div>
<div class="card-body">
  <div *ngFor="let antwort of aktuelleAntwort(); let i = index">
    <button (click)="pruefeAntwort(i)">{{ antwort }}</button>
  </div>
</div>
<div class="card-footer">
  <button (click)="nextFrage()" [disabled]="skipRunde">Nächste Frage</button>
</div>
```

Bei Quiz-Ende:

```html
<div *ngIf="quizAbgeschlossen()">
  <h1>Geschafft!!!</h1>
  <p>Du hast {{ punktzahl() }} von 4 Fragen richtig beantwortet.</p>
  <button (click)="neustart()">RESTART</button>
</div>
```

### 🎨 Styling (CSS-Auszug)

```css
.container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 1px;
  margin-right: 20px;
  flex: 0 0 200px;
}

.card-header, .card-footer {
  background-color: #f8f9fa;
  text-align: center;
  padding: 1.5rem;
}
```

---

## 🔧 Technologien

- [Angular](https://angular.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Bootstrap 5](https://getbootstrap.com/)
- HTML, CSS

## 📝 Lizenz

MIT License

---

**Autor:** [OPuder](https://github.com/OPuder)  
Feedback, Ideen & Pull Requests sind jederzeit willkommen!
