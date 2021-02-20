import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/shared/classes/User';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { USER_ROLES_DEFINITION } from 'src/app/shared/data/UserRoles';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html'
})
export class UserEditComponent implements OnInit {
  USER_ROLES_DEFINITION = USER_ROLES_DEFINITION;

  modalBackConfirmation: BsModalRef;
  // modalDeleteConfirmation: BsModalRef;

  userForm: FormGroup;
  user: User;
  passwordReadyToSubmit = true;

  userNotFound = false;
  userValuesChanges = false;
  changeFormName = false;

  newPassword = '';
  confirmNewPassword = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private userService: UserService,
    private modalService: BsModalService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getCurrentUserInfo();
  }

  getCurrentUserInfo(): void {
    this.authService.getCurrentAuth().subscribe(
      data => {
        this.user = data;
        this.userForm = new FormGroup({
          name: new FormControl(data.name, Validators.required),
          email: new FormControl({value: data.email, disabled: true}),
          // password: new FormControl(''),
          password: new FormControl('', Validators.minLength(5)),
          confirmNewPassword: new FormControl('', Validators.minLength(5))
        });
        this.onFormChanges();
      },
      error => {
        this.userNotFound = true;
      }
    );
  }

  onFormChanges(): void {
    this.userForm.get('name').valueChanges
      .subscribe(_ => this.userValuesChanges !== true ? this.userValuesChanges = true : _ );

    this.userForm.get('password').valueChanges
      .subscribe(_ => {
        this.newPassword = this.userForm.get('password').value;
        if (this.userValuesChanges !== true) {
          this.userValuesChanges = true;
        }

        // if (this.newPassword === this.confirmNewPassword && this.userForm.get('password').value !== '') {
        if (this.newPassword === this.confirmNewPassword) {
          this.passwordReadyToSubmit = true;
        } else {
          if (this.passwordReadyToSubmit !== false) {
            this.passwordReadyToSubmit = false;
          }
        }
       });
    this.userForm.get('confirmNewPassword').valueChanges
      .subscribe(_ => {
        this.confirmNewPassword = this.userForm.get('confirmNewPassword').value;

        // if (this.newPassword === this.confirmNewPassword && this.userForm.get('password').value !== '') {
        if (this.newPassword === this.confirmNewPassword) {
          this.passwordReadyToSubmit = true;
        } else {
          if (this.passwordReadyToSubmit !== false) {
            this.passwordReadyToSubmit = false;
          }
        }
      });

    // this.userForm.get('password').valueChanges
    //   .subscribe(_ => {
    //     if (this.userForm.get('password').value !== '' && this.newPassword !== '' && this.confirmNewPassword !== '') {
    //       this.passwordReadyToSubmit = true;
    //     } else {
    //       if (this.passwordReadyToSubmit !== false) {
    //         this.passwordReadyToSubmit = false;
    //       }
    //     }
    //   });
    }

  updateUser(): void {

    let userValues = this.userForm.value;
    delete userValues.confirmNewPassword;
    if (this.newPassword === '') {
      delete userValues.password;
    }

    this.userService.updateUser(this.user._id, userValues).subscribe(
      data => {
        // this.userService.updateCurrentUser(userValues.name);
        this.toastr.success('Utilizador Atualizado!');
        // this.userService.clearCorrentUser();
        this.authService.updateCurrentAuth().subscribe(
          data => {
            /* if (this.newPassword !== '') {
              this.authService.logout();
              this.router.navigate(['/auth/login']);
            } else {*/
              // this.userService.updateCurrentUser().
              // this.authService.logout();
              // this.router.navigate(['/']);
              this.backPage();
            // }
          },
          error => {
            this.authService.logout();
            this.router.navigate(['/auth/login']);
          }
        );
      },
      error => {
        this.toastr.error(error.message);
      }
    );
  }

  openBackConfirmation(template: TemplateRef<any>) {
    if (this.userValuesChanges) {
      this.modalBackConfirmation = this.modalService.show(template, {class: 'modal-confirm'});
    } else {
      this.backPage();
    }
  }

  confirm(): void {
    this.modalBackConfirmation.hide();
    this.backPage();
  }

  decline(): void {
    this.modalBackConfirmation.hide();
  }

/*   openDeleteModal(template: TemplateRef<any>) {
    this.modalDeleteConfirmation = this.modalService.show(template, {class: 'modal-delete'});
  } */

/*   confirmDeleteModal(): void {
    this.userService.deleteUser(this.user._id).subscribe(
      data => {
        // if (data.docs.deletedCount > 0) {
        this.toastr.success('Utilizador apagado!');
        this.modalDeleteConfirmation.hide();

        this.authService.logout();
        this.router.navigate(['/auth/login']);
        // }
      },
      error => {
        this.toastr.error(error.message ? error.message : 'Erro ao apagar o utilizador!');
      });
  } */

/*   declineDeleteModal(): void {
    this.modalDeleteConfirmation.hide();
  }
 */
  backPage() {
    this.location.back();
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : { notTheSame: true };
  }

}
