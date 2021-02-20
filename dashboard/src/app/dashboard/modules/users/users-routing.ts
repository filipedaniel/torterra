import { Routes } from '@angular/router';
import { UsersComponent } from './components/users.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { AdminGuard } from 'src/app/auth/admin.guard';


export const UsersRoutes: Routes = [
  { path: 'user/edit', component: UserEditComponent },
  { path: '', component: UsersComponent, canActivate: [AdminGuard] },
];
