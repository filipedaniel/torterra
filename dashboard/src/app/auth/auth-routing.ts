import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RecoverComponent } from './recover/recover.component';

export const AuthRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'recover', component: RecoverComponent },
  { path: '' , redirectTo: 'login' , pathMatch: 'full' },
];
