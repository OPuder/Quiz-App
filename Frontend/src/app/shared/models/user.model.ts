export interface User {
    _id: string;
    vorname: string;
    nachname: string;
    spitzname: string;
    email?: string;
    password: string;
    confirmPassword: string;
    role: 'admin' | 'user';
    securityQuestion: string;
    securityAnswer: string;
    geloescht: boolean;
    banned: boolean;
  }

  export interface NewUser {
    vorname: string;
    nachname: string;
    spitzname: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    securityQuestion: string;
    securityAnswer: string;
    confirmPassword?: string;
    geloescht?: boolean;
    banned?: boolean;
  }

  export interface UserUpdatePayload {
    vorname: string;
    nachname: string;
    spitzname: string;
    email?: string;
    role: 'admin' | 'user';
    securityQuestion: string;
    securityAnswer: string;
    password?: string;
    confirmPassword?: string;
    geloescht?: boolean;
    banned?: boolean;
  }