import { User } from '../models/user.model';

export const initialUsers: User[] = [
  {
    id: 'init-admin',
    vorname: 'Admin',
    nachname: 'System',
    spitzname: 'admin',
    email: 'admin@admin.de',
    password: 'admin123',
    role: 'admin',
    securityQuestion: 'Standardfrage?',
    securityAnswer: 'Standardantwort'
  }
];