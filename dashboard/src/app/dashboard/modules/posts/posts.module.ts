import { NgModule } from '@angular/core';

import { PostsComponent } from './components/posts.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostsRoutes } from './posts-routing';
import { SharedModule } from 'src/app/shared/shared.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostItemComponent } from './components/post-item/post-item.component';
import { PostNewComponent } from './components/post-new/post-new.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule, ModalModule, BsDatepickerModule} from 'ngx-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    PostsComponent,
    PostItemComponent,
    PostNewComponent,
    PostDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgSelectModule,
    NgOptionHighlightModule,
    TooltipModule,
    TooltipModule.forRoot(),
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    QuillModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    RouterModule.forChild(PostsRoutes)
  ]
})
export class PostsModule { }
