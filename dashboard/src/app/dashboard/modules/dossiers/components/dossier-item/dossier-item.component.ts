import { Component, OnInit, Input, Output, TemplateRef, EventEmitter } from '@angular/core';
import { Dossier } from 'src/app/shared/classes/Dossier';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DossiersService } from 'src/app/services/dossiers.service';
import { ToastrService } from 'ngx-toastr';
import {trigger, style, animate, transition} from '@angular/animations';
import { fadeInAnimation } from 'src/app/shared/animations/animation';


@Component({
  selector: 'app-dossier-item',
  templateUrl: './dossier-item.component.html',
  animations: [ fadeInAnimation ]
})
export class DossierItemComponent implements OnInit {
  @Input() dossier: Dossier;
  @Output() dossierDeleted = new EventEmitter();

  modalDeleteConfirmation: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private toastr: ToastrService,
    private dossierService: DossiersService) { }


  ngOnInit() { }

  openConfirmationModel(template: TemplateRef<any>) {
    this.modalDeleteConfirmation = this.modalService.show(template, {class: 'modal-delete'});
  }

  confirm(): void {
    this.dossierService.deleteDossier(this.dossier._id).subscribe(
      data => {
        this.toastr.success('Projeto apagado!');
        this.modalDeleteConfirmation.hide();
        this.dossierDeleted.emit(this.dossier._id);
      },
      error => {
        this.toastr.error(error.message ? error.message : 'Erro ao apagar o dossier!');
      });
  }

  decline(): void {
    this.modalDeleteConfirmation.hide();
  }
}
