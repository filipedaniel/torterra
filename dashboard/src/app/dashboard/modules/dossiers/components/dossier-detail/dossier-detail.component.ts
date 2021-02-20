import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DossiersService } from 'src/app/services/dossiers.service';
import { Dossier } from 'src/app/shared/classes/Dossier';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dossier-details',
  templateUrl: './dossier-detail.component.html'
})
export class DossierDetailComponent implements OnInit {

  modalBackConfirmation: BsModalRef;

  dossierForm: FormGroup;
  dossier: Dossier;
  dossierNotFound = false;
  dossierValueChanges = false;

  changeFormTitle = false;
  changeFormDescription = false;
  changeFormImage = false;
  changeFormType  = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private dossierService: DossiersService,
    private modalService: BsModalService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getDossierBySlug();
  }

  getDossierBySlug(): void {
    this.dossierService.getDossierBySlug(this.route.snapshot.paramMap.get('slug'))
      .subscribe(
        data => {
          this.dossier = data;
          this.dossierForm = new FormGroup({
            title: new FormControl(data.title),
            description:  new FormControl(data.description),
            image: new FormControl(data.image)
          });
          this.onFormChanges();
        },
        error => {
          this.dossierNotFound = true;
        }
      );
  }

  onFormChanges(): void {
    this.dossierForm.get('title').valueChanges
      .subscribe(_ => this.dossierValueChanges !== true ? this.dossierValueChanges = true : _ );
    this.dossierForm.get('description').valueChanges
      .subscribe(_ => this.dossierValueChanges !== true ? this.dossierValueChanges = true : _);
    this.dossierForm.get('image').valueChanges
      .subscribe(_ => this.dossierValueChanges !== true ? this.dossierValueChanges = true : _);
  }

  updateDossier(): void {
    if (!this.dossierForm.value.title.trim()) {
      return;
    } else {
      let updateContent = this.dossierForm.value;
      if (this.dossierForm.value.title.trim() === this.dossier.title) {
        delete updateContent.title;
      }

      this.dossierService.updateDossier(this.dossier._id, updateContent).subscribe(
        data => {
          this.toastr.success('Dossier Updated!');
          this.backPage();
        },
        error => {
          this.toastr.error(error.message);
        }
      );

    }
  }

  openBackConfirmation(template: TemplateRef<any>) {
    if (this.dossierValueChanges) {
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

}
