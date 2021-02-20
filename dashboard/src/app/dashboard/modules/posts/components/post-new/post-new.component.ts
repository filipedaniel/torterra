import { Component, OnInit, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService, BsDatepickerConfig } from 'ngx-bootstrap';
import { Post } from 'src/app/shared/classes/Post';
import { PostsService } from 'src/app/services/posts.service';
import { DossiersService } from 'src/app/services/dossiers.service';
import { ToastrService } from 'ngx-toastr';
import { Dossier } from 'src/app/shared/classes/Dossier';


@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html'
})
export class PostNewComponent implements OnInit {
  isLoading = true;

  postForm: FormGroup;
  imagesListForm: FormArray;
  featureImageChange = false;

  modalBackConfirmation: BsModalRef;

  posts: Post[];
  dossiers: Dossier[];

  constructor(
    private modalService: BsModalService,
    private location: Location,
    private postService: PostsService,
    private dossierService: DossiersService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.postForm = this.formBuilder.group({
      title: [null],
      description:  [null],
      featureImage: [null],
      images: this.formBuilder.array([]),
      content: [null],
      author: [null],
      date: [new Date()],
      dossier: [null]
    });

    // set imageslist to the form control containing images
    this.imagesListForm = this.postForm.get('images') as FormArray;

    this.postForm.get('featureImage').valueChanges
       .subscribe(_ => this.featureImageChange !== true ? this.featureImageChange = true : _ );
    this.getDossiers();
  }

  get imagesFormGroup() {
    return this.postForm.get('images') as FormArray;
  }

  // -------

  savePost() {
    if (!this.postForm.value.title.trim()) {
      return;
    } else {
      this.postService.addPost(this.postForm.value).subscribe(
        data => {
          this.toastr.success('Post adicionado!');
          this.backPage();
        },
        error => {
          this.toastr.error(error.message);
        }
      );
    }
  }

  getDossiers(query = '?fields=title,description,image') {
    return this.dossierService.getDossiers(query)
      .subscribe(
        data => {
          this.dossiers = data.docs;
          this.isLoading = false;
        },
        error => {
          this.toastr.error(error.message ? error.message : 'Error!');
          this.isLoading = false;
        });
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
    for (var key in this.postForm.value) {
      if (this.postForm.value[key] !== null) {
        return false;
      }
    }
    return true;
  }

  // -------


  // add a image form group
  addImageToList() {
    this.imagesListForm.push(this.createImage());
  }

  // remove image from group
  removeImage(index) {
    this.imagesListForm.removeAt(index);
  }

  // create image form group
  createImage(): FormGroup {
    return this.formBuilder.group({
      url: ''
    });
  }

  // getImagesFormGroup(index): FormGroup {
  //   this.imagesListForm = this.postForm.get('images') as FormArray;
  //   const formGroup = this.imagesListForm.controls[index] as FormGroup;
  //   return formGroup;
  // }

}
