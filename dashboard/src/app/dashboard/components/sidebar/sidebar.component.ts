import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/users.service';
import { User } from 'src/app/shared/classes/User';
import { USER_ROLES_DEFINITION } from 'src/app/shared/data/UserRoles';
import { flyInOutAnimation } from 'src/app/shared/animations/animation';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  animations: [
    flyInOutAnimation
  ]
})
export class SidebarComponent implements OnInit {
  USER_ROLES_DEFINITION = USER_ROLES_DEFINITION;

  expandSidebar = false;
  currentUser: User;

  constructor(
    public authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.authService.getCurrentAuth().subscribe(
      data => {
        this.currentUser = data;
        this.currentUser.role = this.authService.currentUserRole;
      }
    );
  }

  onToggleSidebar(): void {
    this.expandSidebar = !this.expandSidebar;
  }
  onToggleSidebarFalse(): void {
    this.expandSidebar = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
