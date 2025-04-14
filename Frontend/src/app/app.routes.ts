import { Routes } from '@angular/router';
import { authGuard } from './services/auth/authGuard/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'app-startseite',
        pathMatch: 'full'
    },
    {
        path: 'app-root',
        loadComponent: () => import('./app.component').then(m => m.AppComponent),
    },
    {
        path: 'app-startseite',     
        loadComponent: () => import('./pages/startseite/startseite.component').then(m => m.StartseiteComponent),
    },
    {
        path: 'app-quiz',
        loadComponent: () => import('./features/quiz/quiz/quiz.component').then(m => m.QuizComponent)
    },
    {
        path: 'app-wissenwertes',
        loadComponent: () => import('./pages/wissenwertes/wissenwertes.component').then(m => m.WissenwertesComponent),
    },
    {
        path: 'app-java-script-startseite',
        loadComponent: () => import('./features/quizwahl/java-script-startseite/java-script-startseite.component').then(m => m.JavaScriptStartseiteComponent)
    },
    {
        path: 'app-type-script-startseite',
        loadComponent: () => import('./features/quizwahl/type-script-startseite/type-script-startseite.component').then(m => m.TypeScriptStartseiteComponent),
    },
    {
        path: 'app-angular-startseite',
        loadComponent: () => import('./features/quizwahl/angular-startseite/angular-startseite.component').then(m => m.AngularStartseiteComponent),
    },
    {
        path: 'app-kontakt',
        loadComponent: () => import('./pages/kontakt/kontakt.component').then(m => m.KontaktComponent),
    },
    {
        path: 'app-score-board',
        loadComponent: () => import('./features/score-board/score-board.component').then(m => m.ScoreBoardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'app-login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: 'app-register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    },
    {
        path: 'app-admin',
        loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
        canActivate: [authGuard]  
    },
    {
        path: 'app-password-reset',
        loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.PasswordResetComponent),
    },

];
export class AppRoutingModule {}
