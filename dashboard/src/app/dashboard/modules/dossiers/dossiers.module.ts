import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { DossiersComponent } from './components/dossiers.component';
import { RouterModule } from '@angular/router';
import { DossiersRoutes } from './dossiers-routing';
import { DossiersService } from 'src/app/services/dossiers.service';
import { DossierItemComponent } from './components/dossier-item/dossier-item.component';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';

import { DossierNewComponent } from './components/dossier-new/dossier-new.component';
import { DossierDetailComponent } from './components/dossier-detail/dossier-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DossiersComponent,
    DossierItemComponent,
    DossierNewComponent,
    DossierDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    RouterModule.forChild(DossiersRoutes)
  ],
  providers: [
    DossiersService
  ]
})
export class DossiersModule { }
