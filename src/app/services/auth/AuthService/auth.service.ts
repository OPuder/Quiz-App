import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

private readonly JWT_TOKEN = 'JWT_TOKEN';                                                                
private loggedUser? : string;                                                                           
private isAuthenticated = new BehaviorSubject<boolean>(false);                                          
private Router=inject(Router);                                                                           
private http = inject(HttpClient);                                                                       

constructor() {}

  login(user:{email:string; password:string}):Observable<any> {                                                 
    return this.http
      .post('https://api.escuelajs.co/api/v1/auth/login', user)                                          
      .pipe(                                                                                             
        tap((tokens: any) =>                                                                           
          this.doLoginUser(user.email, JSON.stringify(tokens))                                          
        ),                                         
      );
    }
  private doLoginUser(email: string, token: any) {                                                       
    this.loggedUser = email;                                                                          
    this.storeJwtToken(token);                                                                           
    this.isAuthenticated.next(true);                                                                    
  }
  private storeJwtToken(jwt: string) {                                                                   
   localStorage.setItem(this.JWT_TOKEN, jwt);                                                           
  }
  logout() {                                                                                            
    localStorage.removeItem(this.JWT_TOKEN);                                                            
    this.isAuthenticated.next(false);                                                                    
    this.Router.navigate(['/app-login']);                                                               
  }
    getCurrentAuthUser(): Observable<any> {                                                               
    return this.http.get('https://api.escuelajs.co/api/v1/auth/profile');
  }
  isLoggedIn() {                                                                                        
    return !!localStorage.getItem(this.JWT_TOKEN);                                                      
  }
  isTokenExpired() {                                                                                     
    const tokens =localStorage.getItem(this.JWT_TOKEN);                                                   
    if (!tokens) {                                                                                        
      return true;                                                                                        
    }
    const token = JSON.parse(tokens).access_token;                                                        
    const decoded = jwtDecode(token);                                                                     
    if (!decoded.exp) {                                                                                   
      return true;                                                                                        
    }                                                                                      
      const expirationDate = decoded.exp * 1000;                                                          
      const now = new Date().getTime();                                                                 
      return expirationDate < now;                                                                                                                                 
    }
  refreshToken() {                                                                                       
    let tokens: any = localStorage.getItem(this.JWT_TOKEN);                                              
    if (!tokens) {
      return;                                                                                           
    }
    tokens = JSON.parse(tokens);                                                                         
    let refreshToken = tokens.refresh_token;                                                           
    return this.http                                                                                  
      .post<any>('https://api.escuelajs.co/api/v1/auth/refresh-token',{                                  
        refreshToken,                                                                                   
      }) 
      .pipe(
        tap((tokens: any) =>                                                                              
          this.storeJwtToken(JSON.stringify(tokens))                                                      
        )
      );
  }
}
