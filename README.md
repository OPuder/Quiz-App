# 📚 Quiz-App – Interaktive Lernplattform

Willkommen zur **Quiz-App**, einer modernen Lernplattform zum Üben von Wissen in den Bereichen JavaScript, TypeScript und Angular. Die Anwendung bietet eine unterhaltsame Möglichkeit, dein Wissen zu testen, Highscores zu erreichen und Benutzer zu verwalten – inklusive Admin-Funktionalität und Bannsystem.

---

## 🚀 Features

- 📋 Quizauswahl mit Fragen aus verschiedenen Bereichen
- ✅ Bewertete Antworten mit Punktesystem
- 🧑‍💻 Benutzer-Login/-Registrierung
- 🔒 Passwort-zurücksetzen per Sicherheitsfrage
- 🛡️ Admin-Dashboard mit:
  - Benutzerverwaltung (Hinzufügen, Bearbeiten, Löschen)
  - Bann- und Entbannfunktion mit Grund & Zeitraum
- ⏰ Automatischer Entbann-Check beim Login

---

## 🛠️ Tech-Stack

**Frontend:**

- Angular 18+
- Angular Material
- RxJS, Reactive Forms
- TypeScript

**Backend:**

- Node.js + Express
- MongoDB + Mongoose
- JWT-Auth (Access + Refresh Tokens)
- bcrypt für Passwort-Hashing

---

## ⚙️ Lokale Einrichtung

### 1. Klonen

```bash
git clone https://github.com/OPuder/Quiz-App.git
cd Quiz-App
```

### 2. Backend starten

```bash
cd Backend
npm install
npm run dev
```

> Standard-Port: `http://localhost:5000`

### 3. Frontend starten

```bash
cd Frontend
npm install
ng serve
```

> Standard-Port: `http://localhost:4200`

---

## 🧪 Test-Benutzer

| Rolle  | E-Mail            | Passwort   |
|--------|-------------------|------------|
| Admin  | admin@admin.de    | admin123   |
| User   | user@user.de      | user123    |
| Gebannt | bann@bann.com    | bann123    |

---

## 📦 ToDo

- [x] Passwort zurücksetzen
- [x] Bannsystem mit UI
- [x] Admin-Rollenlogik
- [ ] Quiz-Editor für Admins
- [ ] Highscore-Seite
- [ ] Deployment (z. B. via Vercel + Render)

---

## 👨‍💻 Entwickler

- 🧠 [OPuder](https://github.com/OPuder)

---

## 📄 Lizenz

MIT – free to use & extend
