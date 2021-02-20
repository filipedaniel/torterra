import { Component, OnInit, Input, Output, TemplateRef } from '@angular/core';
import { User } from 'src/app/shared/classes/User';
import { EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/users.service';
import { USER_ROLES_DEFINITION } from 'src/app/shared/data/UserRoles';
import { fadeInAnimation } from 'src/app/shared/animations/animation';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
  animations: [ fadeInAnimation ]
})
export class UserItemComponent implements OnInit {
  @Input() user: User;
  // @Input() isRoot: boolean;
  // @Input() isAdmin: boolean;
  @Input() currentUser: User;
  @Output() userDeleted = new EventEmitter();
  @Output() userUpdated = new EventEmitter();

  USER_ROLES_DEFINITION = USER_ROLES_DEFINITION;

  modalAdminConfirmation: BsModalRef;
  modalUserConfirmation: BsModalRef;
  modalDeleteConfirmation: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private toastr: ToastrService,
    private userService: UserService) { }

  ngOnInit() {
  }

  openDeleteModal(template: TemplateRef<any>) {
    this.modalDeleteConfirmation = this.modalService.show(template, {class: 'modal-delete'});
  }

  confirmDeleteModal(): void {
    this.userService.deleteUser(this.user._id).subscribe(
      data => {
        // if (data.docs.deletedCount > 0) {
        this.toastr.success('Utilizador apagado!');
        this.modalDeleteConfirmation.hide();
        this.userDeleted.emit(this.user._id);
        // } else {
        //  this.toastr.error('Erro ao apagar o projeto!');
        //  this.modalDeleteConfirmation.hide();
        // }
      },
      error => {
        this.toastr.error(error.message ? error.message : 'Erro ao apagar o utilizador!');
      });
  }

  declineDeleteModal(): void {
    this.modalDeleteConfirmation.hide();
  }

  openAdminModal(template: TemplateRef<any>) {
    this.modalAdminConfirmation = this.modalService.show(template, {class: 'modal-admin-confirmation'});
  }

  openUserModal(template: TemplateRef<any>) {
    this.modalUserConfirmation = this.modalService.show(template, {class: 'modal-user-confirmation'});
  }

  confirmAdminModal(): void {
    this.userService.updateUser(this.user._id, { role: USER_ROLES_DEFINITION.Admin }).subscribe(
      data => {
        // if (data.docs.deletedCount > 0) {
        this.toastr.success('Utilizador atualizado!');
        this.modalAdminConfirmation.hide();
        this.userUpdated.emit(this.user._id);
        // } else {
        //  this.toastr.error('Erro ao apagar o projeto!');
        //  this.modalDeleteConfirmation.hide();
        // }
      },
      error => {
        this.toastr.error(error.message ? error.message : 'Erro ao atualizar o utilizador!');
      });
  }

  confirmUserModal(): void {
    this.userService.updateUser(this.user._id, { role: USER_ROLES_DEFINITION.User }).subscribe(
      data => {
        // if (data.docs.deletedCount > 0) {
        this.toastr.success('Utilizador atualizado!');
        this.modalUserConfirmation.hide();
        this.userUpdated.emit(this.user._id);
        // } else {
        //  this.toastr.error('Erro ao apagar o projeto!');
        //  this.modalDeleteConfirmation.hide();
        // }
      },
      error => {
        this.toastr.error(error.message ? error.message : 'Erro ao atualizar o utilizador!');
      });
  }

  declineAdminModal(): void {
    this.modalAdminConfirmation.hide();
  }

  declineUserModal(): void {
    this.modalUserConfirmation.hide();
  }

}
