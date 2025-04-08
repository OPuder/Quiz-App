export interface User {
    id: string;
    vorname?: string;
    nachname?: string;
    spitzname?: string;
    email: string;
    password: string;
    role: 'admin' | 'user' | 'banned';
    securityQuestion: string;
    securityAnswer: string;
  }