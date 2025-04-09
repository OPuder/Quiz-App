import { HttpInterceptorFn } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Hole den Token über die AuthService-Methode
  const jwtToken = getJwtToken();
  
  if (jwtToken) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return next(clonedReq);
  }
  return next(req);
};

// Funktion zur Extraktion des JWT-Tokens
function getJwtToken(): string | null {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return null;
  }

  const tokens: any = localStorage.getItem('JWT_TOKEN');
  if (!tokens) {
    return null;
  }

  try {
    const token = JSON.parse(tokens).access_token;
    if (isTokenExpired(token)) {
      return null; // Falls der Token abgelaufen ist, gib null zurück
    }
    return token;
  } catch (error) {
    console.error('Ungültiger Token', error);
    return null;
  }
}

// Überprüfe, ob der Token abgelaufen ist
function isTokenExpired(token: string): boolean {
  const decoded: any = jwtDecode(token);
  const expirationDate = decoded.exp * 1000;
  const now = new Date().getTime();
  return expirationDate < now;
}
