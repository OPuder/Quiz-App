export interface User {
    vorname: string;
    nachname: string;
    spitzname: string;
    email?: string;
    password: string;
    confirmPassword: string;
    role: 'admin' | 'user' | 'banned';
    securityQuestion: string;
    securityAnswer: string;
  }