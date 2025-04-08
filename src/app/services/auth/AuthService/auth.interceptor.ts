import { HttpInterceptorFn } from '@angular/common/http';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtToken = getJwtToken();
  if (jwtToken) {
    const clonedReg = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return next(clonedReg);
  }
  return next(req);
};
function getJwtToken(): string | null {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return null;
  }
  const tokens: any = localStorage.getItem('JWT_TOKEN');
  if (!tokens) {
    return null;
  }
  const token = JSON.parse(tokens).access_token;
  return token;
}
