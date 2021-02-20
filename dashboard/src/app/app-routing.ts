import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/components/dashboard/dashboard.component';
import { DashboardRoutes } from './dashboard/dashboard-routing';

import { PagenotfoundComponent } from './shared/components/pagenotfound/pagenotfound.component';
import { AuthComponent } from './auth/auth.component';
import { AuthRoutes } from './auth/auth-routing';
import { AuthGuard } from './auth/auth.guard';

export const AppRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, children: DashboardRoutes, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent, children: AuthRoutes },
  { path: '' , redirectTo: '/dashboard/posts' , pathMatch: 'full' },
  { path: '**', component: PagenotfoundComponent }
];
