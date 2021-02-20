import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AjaxRequest } from '../shared/classes/AjaxRequest';
import { Post } from '../shared/classes/Post';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private baseUrl = environment.apiBaseUrl + '/post';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  // get all posts
  getPosts(query: string = ''): Observable<AjaxRequest<Post[]>> {
    return this.http.get<AjaxRequest<Post[]>>(this.baseUrl + query);
  }

  // get post by slug
  getPostBySlug(slug: string, query: string = ''): Observable<Post> {
    const url = this.baseUrl + '/slug/' + slug + query;
    return this.http.get<Post>(url);
  }

  // delete post by id
  deletePost(id: string): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url, this.httpOptions);
  }

  // add new post
  addPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.baseUrl, post, this.httpOptions);
  }

  updatePost(postId: string, post: Post): Observable<Post> {
    return this.http.patch<Post>(this.baseUrl + '/' + postId, post, this.httpOptions);
  }
}
