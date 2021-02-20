import { Routes } from '@angular/router';
import { AdminGuard } from '../auth/admin.guard';


export const DashboardRoutes: Routes = [
  {
    path: 'dossiers',
    loadChildren: () => import('./modules/dossiers/dossiers.module').then(m => m.DossiersModule)
  },
  {
    path: 'posts',
    loadChildren: () => import('./modules/posts/posts.module').then(m => m.PostsModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule)
  },
  {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full'
  }
];
