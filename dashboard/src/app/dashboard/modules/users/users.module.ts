import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './components/users.component';
import { RouterModule } from '@angular/router';
import { UsersRoutes } from './users-routing';
import { UserService } from 'src/app/services/users.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserItemComponent } from './components/user-item/user-item.component';
import { ModalModule } from 'ngx-bootstrap';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    UsersComponent,
    UserItemComponent,
    UserEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(UsersRoutes)
  ],
  providers: [
    UserService
  ]
})
export class UsersModule { }
