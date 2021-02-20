import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Post } from 'src/app/shared/classes/Post';
import { Dossier } from 'src/app/shared/classes';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PostsService } from 'src/app/services/posts.service';
import { DossiersService } from 'src/app/services/dossiers.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html'
})
export class PostDetailComponent implements OnInit {
  isLoading = true;
  readySlugPost = false;
  readyDossiers = false;

  modalBackConfirmation: BsModalRef;

  postForm: FormGroup;
  imagesListForm: FormArray;

  post: Post;
  dossiers: Dossier[];

  postNotFound = false;
  postValueChanges = false;
  changeFormImages = false;
  changeContent = false;
  changeDate = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private postService: PostsService,
    private dossierService: DossiersService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getPostBySlug();
    this.getDossiers();
  }

  getPostBySlug(): void {
    this.postService.getPostBySlug(this.route.snapshot.paramMap.get('slug'))
      .subscribe(
        data => {
          this.post = data;

          this.postForm = this.formBuilder.group({
            title: [data.title],
            description:  [data.description],
            featureImage: [data.featureImage],
            images: this.formBuilder.array([]),
            content: [data.content],
            author: [data.author],
            date: [new Date(data.date)],
            dossier: [data.dossier]
          });

          // set imageslist to the form control containing images
          this.imagesListForm = this.postForm.get('images') as FormArray;
          // this.imageReady = new Array(data.images.length);
          // this.imageReady.fill(1);
          for (const img of data.images) {
            this.addImageToList(img.url);
          }

          this.onFormChanges();

          this.readySlugPost = true;
          if (this.readyDossiers === true) {
            this.isLoading = false;
          }
        },
        error => {
          this.postNotFound = true;
        }
      );
  }

  onFormChanges(): void {
    this.postForm.get('title').valueChanges
      .subscribe(_ => this.postValueChanges !== true ? this.postValueChanges = true : _ );
    this.postForm.get('description').valueChanges
    .subscribe(_ => this.postValueChanges !== true ? this.postValueChanges = true : _ );
    this.postForm.get('featureImage').valueChanges
      .subscribe(_ => this.postValueChanges !== true ? this.postValueChanges = true : _ );
    this.postForm.get('images').valueChanges
      .subscribe(_ => {
        this.changeFormImages !== true ? this.changeFormImages = true : _ ;
        this.postValueChanges !== true ? this.postValueChanges = true : _ ;
      } );
    this.postForm.get('content').valueChanges
      .subscribe(_ => {
        this.changeContent !== true ? this.changeContent = true : _ ;
        this.postValueChanges !== true ? this.postValueChanges = true : _ ;
      } );
    this.postForm.get('author').valueChanges
      .subscribe(_ => this.postValueChanges !== true ? this.postValueChanges = true : _ );
    this.postForm.get('date').valueChanges
      .subscribe(_ => {
        this.changeDate !== true ? this.changeDate = true : _ ;
        this.postValueChanges !== true ? this.postValueChanges = true : _ ;
      });
    this.postForm.get('dossier').valueChanges
      .subscribe(_ => this.postValueChanges !== true ? this.postValueChanges = true : _ );
  }

  updatePost(): void {
    if (!this.postForm.value.title.trim()) {
      return;
    } else {
      let updateContent = this.postForm.value;
      if (this.postForm.value.title.trim() === this.post.title) {
        delete updateContent.title;
      }

      this.postService.updatePost(this.post._id, updateContent).subscribe(
        data => {
          this.toastr.success('Post atualizado com sucesso!');
          this.backPage();
        },
        error => {
          this.toastr.error(error.message);
        }
      );
    }
  }

  openBackConfirmation(template: TemplateRef<any>) {
    if (this.postValueChanges) {
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

  getDossiers(query = '?fields=title,description') {
    return this.dossierService.getDossiers(query)
      .subscribe(
        data => {
          this.dossiers = data.docs;

          this.readyDossiers = true;
          if (this.readySlugPost === true) {
            this.isLoading = false;
          }
        },
        error => {
          this.toastr.error(error.message ? error.message : 'Error!');
          this.isLoading = false;
        });
  }


    // ----

  // add a image form group
  addImageToList(url = '') {
    this.imagesListForm.push(this.createImage(url));
  }

  // remove image from group
  removeImage(index) {
    this.imagesListForm.removeAt(index);

    /* if (this.imageReady.length > index) {
      this.imageReady.splice(-1, 1);
    } */
  }

  // create image form group
  createImage(url = ''): FormGroup {
    return this.formBuilder.group({
      url: url
    });
  }

  getImagesFormGroup(index): FormGroup {
    this.imagesListForm = this.postForm.get('images') as FormArray;
    const formGroup = this.imagesListForm.controls[index] as FormGroup;
    return formGroup;
  }

  get imagesFormGroup() {
    // console.log("> " + this.classForm.get('images'));
    // return this.classForm.controls['images'] as FormArray;
    return this.postForm.get('images') as FormArray;
  }

  /* somethingChanged() {
    this.imageReady.push(1);
  }*/

}
