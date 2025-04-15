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
    banned: {
      isBanned: boolean;
      reason: string;
      until: Date | null;
    };
  }

  export interface NewUser {
    vorname: string;
    nachname: string;
    spitzname: string;
    email: string;
    password: string;
    confirmPassword?: string;
    role: 'user' | 'admin';
    securityQuestion: string;
    securityAnswer: string;
    geloescht?: boolean;
    banned?: {
      isBanned: boolean;
      reason: string;
      until: Date | null;
    };
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
    banned?: {
      isBanned: boolean;
      reason: string;
      until: Date | null;
    };
  }