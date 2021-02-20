import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AjaxRequest } from '../shared/classes/AjaxRequest';
import { User } from '../shared/classes/User';
import { tap} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.apiBaseUrl + '/user';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  // Get all Users
  getUsers(query: string = ''): Observable<AjaxRequest<User[]>> {
    return this.http.get<AjaxRequest<User[]>>(this.baseUrl + query);
  }

  getCurrentUser() {
      return this.http.get<User>(this.baseUrl + '/current/info');
  }

  // Delete user by id
  deleteUser(id: string): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url, this.httpOptions);
  }

  // Post new user
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl + '/register', user, this.httpOptions);
  }

  // update user
  updateUser(userId: string, user): Observable<User> {
    return this.http.patch<User>(this.baseUrl + '/' + userId, user, this.httpOptions);
  }

  changePassword(credencials): Observable<User> {
    return this.http.post<User>(this.baseUrl + '/password/update' + credencials, this.http);
  }
}
