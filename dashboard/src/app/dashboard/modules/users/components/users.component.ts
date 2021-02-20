import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/shared/classes/User';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { USER_ROLES_DEFINITION } from 'src/app/shared/data/UserRoles';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  USER_ROLES_DEFINITION = USER_ROLES_DEFINITION;

  isLoading = true;
  isSubmit = false;

  users: User[];
  currentUser: User;
  usersAdmin: User[] = [];
  usersUser: User[] = [];

  totalUsers = 0;

  userForm: FormGroup;
  modalAddUser: BsModalRef;

  constructor(
    private usersService: UserService,
    private authService: AuthService,
    private modalService: BsModalService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getUsers('?limit=100');
    this.userForm = new FormGroup({
      name: new FormControl(),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      role: new FormControl('0')
    });
    this.authService.getCurrentAuth().subscribe(
      data => {
        this.currentUser = data;
        this.currentUser.role = this.authService.currentUserRole;
      }
    );
  }

  getUsers(query = '') {
    return this.usersService.getUsers(query)
      .subscribe(
        data => {
          this.usersAdmin = [];
          this.usersUser = [];

          this.totalUsers = data.total;
          this.users = data.docs;

          this.users.forEach(user => {
            if (user.role === USER_ROLES_DEFINITION.Admin) {
              // user.role = USER_ROLES.find(r => +r.id === +user.role).description;
              this.usersAdmin.push(user);
            } else if (user.role === USER_ROLES_DEFINITION.User) {
              // user.role = USER_ROLES.find(r => +r.id === +user.role).description;
              this.usersUser.push(user);
            }
          });

          /*this.users.forEach(u => {
            u.role = USER_ROLES.find(r => +r.id === +u.role).description;
          });*/

          // --
          this.isLoading = false;
        },
        error => {
          this.toastr.error(error.message ? error.message : 'Error!');
          this.isLoading = false;
        }
      );
  }

  userEventEmit(event?) {
    this.getUsers('?limit=100');
  }

  openModalAddUser(template: TemplateRef<any>) {
    this.modalAddUser = this.modalService.show(template, {class: 'modal-add-user'});
  }

  saveUser() {
    this.isSubmit = true;
    if (!this.userForm.value.name.trim()) {
      return;
    } else {
      this.usersService.addUser(this.userForm.value).subscribe(
        data => {
          this.modalAddUser.hide();
          this.toastr.success('Utilizador inserido!');
          this.userEventEmit();
          this.isSubmit = false;
          this.userForm.reset();
          this.userForm.controls["role"].setValue('0');
        },
        error => {
          this.toastr.error(error.message);
          this.isSubmit = false;
        }
      );
    }

  }

}
