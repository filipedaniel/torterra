import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/shared/classes/Post';
import { PostsService } from 'src/app/services/posts.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html'
})

export class PostsComponent implements OnInit {
  isLoading = true;
  searchQuery = '';

 // list of posts
  data: Post[];

  // pagination options
  totalDocs: number;
  docsLimit: number;
  actualPage: number;
  totalPages: number;

  searchInput = '';

  constructor(
    private postService: PostsService,
    private toastr: ToastrService) { }

  ngOnInit() { this.getPosts(); }

  getPosts(query = '') {
    return this.postService.getPosts(query)
      .subscribe(
        data => {
          this.totalDocs = data.total;
          this.docsLimit = data.limit;
          this.actualPage = data.page;
          this.totalPages = data.total;
          this.data = data.docs;
          this.isLoading = false;
        },
        error => {
          this.toastr.error(error.message ? error.message : 'Error!');
          this.isLoading = false;
        });
  }

  deletePost(post) {
    this.getPosts();
  }

  search(post): void {
    if (post.target.value === '') {
      this.isLoading = true;
      this.searchInput = '';
      this.getPosts();
    } else {
      if (post.keyCode == 13) {
        this.isLoading = true;
        // this.pageState = 1;
        this.searchInput = `?search=${post.target.value}`;
        this.getPosts(this.searchInput);
      }
    }
  }

  pageChanged(post): void {
    this.isLoading = true;
    const pageQuery = `limit=${this.docsLimit}&page=${post.page}`;
    const getQuery = this.searchInput === '' ? `?${pageQuery}` : `${this.searchInput}&${pageQuery}`;

    this.getPosts(getQuery);
    window.scrollTo(0, 0);
  }

}
