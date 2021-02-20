import { Component, OnInit, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DossiersService } from 'src/app/services/dossiers.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dossier-new',
  templateUrl: './dossier-new.component.html'
})
export class DossierNewComponent implements OnInit {
  dossierForm: FormGroup;
  modalBackConfirmation: BsModalRef;
  imageChange: boolean;

  constructor(
    private modalService: BsModalService,
    private location: Location,
    private dossierService: DossiersService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.dossierForm = new FormGroup({
      title: new FormControl(),
      description:  new FormControl(),
      image: new FormControl(),
      type: new FormControl()
    });

    this.dossierForm.get('image').valueChanges
    .subscribe(_ => this.imageChange !== true ? this.imageChange = true : _ );
  }

  saveDossier() {
    if (!this.dossierForm.value.title.trim()) {
      return;
    } else {
      this.dossierService.addDossier(this.dossierForm.value).subscribe(
        data => {
          this.toastr.success('Novo projeto adicionado!');
          this.backPage();
        },
        error => {
          this.toastr.error(error.message);
        }
      );
    }
  }

  openBackConfirmation(template: TemplateRef<any>) {
    if (!this.emptyFormObject()) {
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

  backPage() {
    this.location.back();
  }

  emptyFormObject() {
    for (var key in this.dossierForm.value) {
      if (this.dossierForm.value[key] !== null) {
        return false;
      }
    }
    return true;
  }
}
