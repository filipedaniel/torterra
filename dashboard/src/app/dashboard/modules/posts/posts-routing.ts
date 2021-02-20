import { PostsComponent } from './components/posts.component';
import { Routes } from '@angular/router';
import { PostNewComponent } from './components/post-new/post-new.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';

export const PostsRoutes: Routes = [
  { path: 'new', component: PostNewComponent },
  { path: ':slug', component: PostDetailComponent },
  { path: '', component: PostsComponent }
];
