import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../shared/classes/User';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from './users.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiBaseUrl + '/user';
  currentUserId: string;
  currentUserRole: number;
  currentUserName: string;
  public currentUser: User;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private cookieService: CookieService) { }


  login(credentials): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/login', credentials, this.httpOptions)
      .pipe(
        tap(data => {
          const helper = new JwtHelperService();
          const decodedToken = helper.decodeToken(data.authToken);
          const expireDate = helper.getTokenExpirationDate(data.authToken);

          this.cookieService.set('AID', data.authToken, expireDate);
          this.currentUserId = decodedToken.userId;
          this.currentUserRole = decodedToken.role;
          this.userService.getCurrentUser().subscribe(
            user => {
              this.currentUser = user;
            }
          );
          // this.userService.updateCurrentUser();
        })
      );
  }

  recover(email): Observable<User> {
    return this.http.post<User>(this.baseUrl + '/password/reset', email, this.httpOptions);
  }

  logout() {
    // this.userService.clearCorrentUser();
    this.cookieService.delete('AID');
  }

  getCurrentAuth() {
    return this.currentUser
      ? of(this.currentUser) :
        this.userService.getCurrentUser()
        .pipe( tap(data => { this.currentUser = data; }));
  }

  updateCurrentAuth() {
    return this.userService.getCurrentUser()
        .pipe( tap(data => { this.currentUser = data; }));
  }

  getToken() {
    return this.cookieService.get('AID');
  }

  isAuthenticated() {
    const res = this.cookieService.get('AID');
    if (res) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(res);
      const expired =  helper.isTokenExpired(res);
      if (expired) {
        this.logout();
      }
      this.currentUserId = decodedToken.userId;
      this.currentUserRole = decodedToken.role;
      // this.currentUserRole = 1;
      return true;
    }
    return false;
  }

}
