import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { USER_ROLES_DEFINITION } from 'src/app/shared/data/UserRoles';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  USER_ROLES_DEFINITION = USER_ROLES_DEFINITION;
  constructor(
    private authService: AuthService) {}


canActivate(): boolean {
    if (this.authService.currentUserRole === USER_ROLES_DEFINITION.Admin ||
        this.authService.currentUserRole === USER_ROLES_DEFINITION.Root) {
      return true;
    } else {
      // this.router.navigate(['/dashboard/posts']);
      return false;
    }
  }
}
