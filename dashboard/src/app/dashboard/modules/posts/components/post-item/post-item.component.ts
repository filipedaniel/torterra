import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { Post } from 'src/app/shared/classes/Post';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PostsService } from 'src/app/services/posts.service';
import { fadeInAnimation } from 'src/app/shared/animations/animation';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  animations: [ fadeInAnimation ]
})
export class PostItemComponent implements OnInit {
  @Input() post: Post;
  @Output() postDeleted = new EventEmitter();

  modalDeleteConfirmation: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private toastr: ToastrService,
    private postService: PostsService) { }

  ngOnInit() {
  }

  openConfirmationModel(template: TemplateRef<any>) {
    this.modalDeleteConfirmation = this.modalService.show(template, {class: 'modal-delete'});
  }

  confirm(): void {
    this.postService.deletePost(this.post._id).subscribe(
      data => {
        this.toastr.success('Post apagado com sucesso!');
        this.modalDeleteConfirmation.hide();
        this.postDeleted.emit(this.post._id);
      },
      error => {
        this.toastr.error(error.message ? error.message : 'Erro ao apagar o post!');
      });
  }

  decline(): void {
    this.modalDeleteConfirmation.hide();
  }

}
